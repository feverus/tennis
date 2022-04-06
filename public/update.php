<?php
header('Content-Type: text/html; charset=utf-8');
$user_agent = file('ua.txt');

//ставка на фаворита
$favBet = 100;
//ставка на отстающего
$lagBet = 50;
//граница коэффициента для отделения фаворита от отстающего
$kFavLag = 1.91;





//запрос к сайту
function request($url, $post = 0){
	global $user_agent;	
    $nomer = random_int(0,count($user_agent)-1);
	if (file_exists('cookie/cookie.txt')) {unlink('cookie/cookie.txt');}    
	if (strpos($url , 'https://')===false) {
		if ($url[1]==='/') {substr($url,1,0);}
		if ($url[1]==='/') {substr($url,1,0);}
		$url='https://'.$url;	
	}
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url ); // отправляем на
	curl_setopt($ch, CURLOPT_HEADER, 0); // пустые заголовки
	curl_setopt($ch, CURLOPT_USERAGENT, trim($user_agent[$nomer]));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // возвратить то что вернул сервер
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // следовать за редиректами
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);// таймаут4
	curl_setopt($ch, CURLOPT_TIMEOUT, 120);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_COOKIEJAR, dirname(__FILE__).'/cookie/cookie.txt'); // сохранять куки в файл
	curl_setopt($ch, CURLOPT_COOKIEFILE,	dirname(__FILE__).'/cookie/cookie.txt');
	curl_setopt($ch, CURLOPT_POST, $post!==0 ); // использовать данные в post
	if($post)
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	$data = curl_exec($ch);
	curl_close($ch);
	return $data;
}





//функция парсинга данных со страницы игрока
function playerStat($url, $year, $surface){
	$active = true;
	$stat = ["date"=>[], "winner"=>[], "kf"=>[]];
	$urlEscaped = str_ireplace("/" , "\/", $url);
	$url = 'https://www.tennisexplorer.com'.$url.'?annual='.$year;
	if ($surface!==0) {
		$url.= '&surface='.$surface;
	}
	$page = request($url);
    if (preg_match_all('/<div id="matches-'.$year.'-1-data"(.*?)<\/div>/smi', $page, $matches, PREG_PATTERN_ORDER)!==false) {
		if (isset($matches[1][0])) {
			$page = trim($matches[1][0]);
		} else {
			$active = false;
		}
	}
	if ($active) {
		//перебираем матчи
		if (preg_match_all('/<tr class="[one|two)]+">(.*?)<\/tr>/smi', $page, $matches, PREG_PATTERN_ORDER)!==false) {
			foreach ($matches[1] as $key => $tr) {
				if (preg_match_all('/<td class="first time">(.*?)<\/td>/smi', $tr, $m, PREG_PATTERN_ORDER)!==false) {
					$tempDate = trim($m[1][0]).$year;
				} else {
					$tempDate = '01.01.1900';//чтобы не попасть в выборку
				}
				if (((strtotime("now") - strtotime($tempDate)) / 86400) < 365) {
					$stat["date"][] = $tempDate;		
					if (preg_match_all('/<td class="t-name"><a href="'.$urlEscaped.'/smi', $tr, $m, PREG_PATTERN_ORDER)!==false) {
						if (count($m[0])>0) {
							$stat["winner"][] = true;
						} else {
							$stat["winner"][] = false;
						}
					}			
					if (preg_match_all('/<td class="course">(.*?)<\/td>/smi', $tr, $m, PREG_PATTERN_ORDER)!==false) {
						if ($stat["winner"][count($stat["winner"])-1] === true) {
							if ($m[1][0]!=='&nbsp;') {$stat["kf"][] = $m[1][0];} else {$stat["kf"][] = 1;}							
						} else {
							if ($m[1][1]!=='&nbsp;') {$stat["kf"][] = $m[1][1];} else {$stat["kf"][] = 1;}	
						}
					}
				}
			}
		}
	}
	return $stat;
}





//подсчет побед/поражений/рейтинга
function rateCalculate($winner, $kf){
	global $favBet, $lagBet, $kFavLag;
	$wlr = [0, 0, 0];
	if ($winner === true) {
		$wlr[0]++;
	} else {
		$wlr[1]++;
	}
	if ($kf < $kFavLag) {
		if ($winner === true) {
			$wlr[2] = round(($favBet * $kf) - $favBet , 2);
		} else {
			$wlr[2] = 0 - $favBet;
		}
	} else {
		if ($winner === true) {
			$wlr[2] = round(($lagBet * $kf) - $lagBet , 2);
		} else {
			$wlr[2] = 0 - $lagBet;
		}					
	}
	return $wlr;
}





//суммирование массивов поэлементно
function sumArray($a1, $a2){
	if (count($a1)===count($a2)) {
		foreach ($a1 as $key => $value) {
			$res[] = $a1[$key] + $a2[$key];
		}
	} else {
		$res = 'error';
	}
	return $res;
}


























































//сначала проверяем, не запушено ли уже обновление
$status = file_get_contents('update_status.txt');
$status = json_decode($status);
if ($status->{'ready'} === 'no') {
	echo 'Update in process';
	exit;
}
$lastUpdateDate = $status->{'date'};
$thisUpdateDate = date("j n Y", strtotime("now"));
//или с момента последнего обновления прошло мало времени
if ($lastUpdateDate===$thisUpdateDate) {
	if ((date("G", strtotime("now")) - $status->{'ready'}) < 4) {
		echo 'Please wait a few hours before update';
		exit;
	}
}
$progress = ['date'=>$lastUpdateDate, 'count'=>0, 'ready'=>"no"];
file_put_contents('update_status.txt', json_encode($progress));




//получаем список игроков
$players = ["url"=>[], "fio"=>[], "statistics"=>[]];
$sex = ['atp-men', 'wta-women'];
for ($p=1; $p<=6; $p++) {
	for ($s=0; $s<=1; $s++) {
		$page_spisok = request('https://www.tennisexplorer.com/ranking/'.$sex[$s].'/?page='.$p);
		if (preg_match_all('/<tbody class="flags">(.*?)<\/tbody>/smi', $page_spisok, $matches, PREG_PATTERN_ORDER)!==false) {
			$page_spisok = trim($matches[1][0]);
		}
		if (preg_match_all('/<td class="t-name"><a href="([^"]+)">([^<]+)<\/a><\/td>/smi', $page_spisok, $matches, PREG_PATTERN_ORDER)!==false) {
			foreach ($matches[1] as $key => $value) {
				$players["url"][] = $value;
			}
			foreach ($matches[2] as $key => $value) {
				$players["fio"][] = $value;
			}
		}   
	}
}







/*
перебираем игроков
30 дней - (побед, поражений, рейт) * 6
1 год - (побед, поражений, рейт) * 6
*/
$done = 0;
foreach ($players["url"] as $key => $value) {
	//if ($key < 2) { //убрать в релизе
		$surfaces = ["all", "indoors", "clay", "grass", "hard", "not set"];
		$statistics = ["28"=>["all"=>[], "indoors"=>[], "clay"=>[], "grass"=>[], "hard"=>[], "not set"=>[]], 
				"365"=>["all"=>[], "indoors"=>[], "clay"=>[], "grass"=>[], "hard"=>[], "not set"=>[]]];
		for ($s=0; $s<=5; $s++) {
			$winLoseRate28 = [0, 0, 0]; //(побед, поражений, рейт)		
			$winLoseRate365 = [0, 0, 0];
			$a = playerStat($value, date("Y", strtotime("now")), $s);
			$b = playerStat($value, date("Y", strtotime("now")) - 1, $s);
			$ab["date"] = array_merge($a["date"], $b["date"]);
			$ab["winner"] = array_merge($a["winner"], $b["winner"]);
			$ab["kf"] = array_merge($a["kf"], $b["kf"]);
			foreach ($ab["date"] as $k => $date) {	
				$wlr = rateCalculate($ab["winner"][$k] , $ab["kf"][$k]);
				//echo $value.' kf> '.$ab["kf"][$k].' wlr: '.$wlr[0].' '.$wlr[1].' '.$wlr[2].' '.$winLoseRate28[2].'--'.$winLoseRate365[2].' '.((strtotime("now") - strtotime($date)) / 86400).' : '.$date."\r\n";//убрать в релизе
				if ($wlr!=='error') {				
					if (((strtotime("now") - strtotime($date)) / 86400) <= 28) {
						$winLoseRate28 = sumArray($winLoseRate28 , $wlr); 
					}
					if (((strtotime("now") - strtotime($date)) / 86400) <= 365) {
						$winLoseRate365 = sumArray($winLoseRate365 , $wlr); 
					}	
				}		
			}
			$statistics["28"][$surfaces[$s]] = $winLoseRate28;
			$statistics["365"][$surfaces[$s]] = $winLoseRate365;
			$done++;
			$progress = ['date'=>$lastUpdateDate, 'count'=>$done, 'ready'=>"no"];
			file_put_contents('update_status.txt', json_encode($progress));		
		}
		$players["statistics"][$key] = $statistics;
	//} //убрать в релизе
}

//сохраняем 

	//$datatoprintlog = print_r($players,true);
	//file_put_contents('players.txt', $datatoprintlog, FILE_APPEND);

	$csv = 'Player;28 all wins;28 all fails;28 all rate;28 indoors wins;28 indoors fails;28 indoors rate;28 clay wins;28 clay fails;28 clay rate;28 grass wins;28 grass fails;28 grass rate;28 hard wins;28 hard fails;28 hard rate;28 not set wins;28 not set fails;28 not set rate;365 all wins;365 all fails;365 all rate;365 indoors wins;365 indoors fails;365 indoors rate;365 clay wins;365 clay fails;365 clay rate;365 grass wins;365 grass fails;365 grass rate;365 hard wins;365 hard fails;365 hard rate;365 not set wins;365 not set fails;365 not set rate'."\r\n";
	foreach ($players["fio"] as $key => $value) {
		$csv .= $value;
		$v = $players["statistics"][$key];
		foreach ($v["28"] as $kS => $vS) {
			for ($i=0; $i<=2; $i++) {
				$csv .= ';'.$vS[$i];
			}
		}
		foreach ($v["365"] as $kS => $vS) {
			for ($i=0; $i<=2; $i++) {
				$csv .= ';'.$vS[$i];
			}
		}		
		$csv .= "\r\n";
	}

	unlink($lastUpdateDate.'.csv');	
	unlink($lastUpdateDate.'_json.txt');
	unlink('update_status.txt');

	file_put_contents($thisUpdateDate.'.csv');
	file_put_contents($thisUpdateDate.'_json.txt', json_encode($players));

	$progress = ['date'=>$thisUpdateDate, 'count'=>0, 'ready'=>date("G", strtotime("now"))];
	file_put_contents('update_status.txt', json_encode($progress));
?>
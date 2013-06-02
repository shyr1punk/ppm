<?php
    header('Content-type: application/json');
    header('Content-Type: text/html; charset=utf-8');
    require_once "Config.php";
    require_once "Mysql.php";
    $DB = DbSimple_Generic::connect(DBCONFIG);
    $DB->query('SET NAMES utf8');
    if($_GET["type"]=="ppm"){
        $rows = $DB->select('SELECT * FROM cities where population >= 100');
        foreach ($rows as $numRow => $row) {
            $fields['ID'] = $row['cityID'];
            $fields['name'] = $row['name'];
            $fields['area'] = $row['areaName'];
            $fields['lat'] = $row['lat'];
            $fields['lng'] = $row['lng'];
            $data[] = $fields;
        }
    }
    if($_GET["type"]=="airport"){
        $rows = $DB->select('SELECT icao_code, name_rus, latitude, longitude FROM airports where runway_length >= 3000');
        foreach ($rows as $numRow => $row) {
            $fields['code'] = $row['icao_code'];
            $fields['name'] = $row['name_rus'];
            $fields['lat'] = $row['latitude'];
            $fields['lng'] = $row['longitude'];
            $data[] = $fields;
        }
    }
    if($_GET["type"]=="routes"){
        $res = $DB->select('SELECT id, begin, end FROM routes');
        foreach ($res as $numRow => $row) {
            $fields['id'] = $row['id'];
            $fields['begin'] = $row['begin'];
            $fields['end'] = $row['end'];
            $data[$fields['id']] = $fields;
        }
        $rows = $DB->select('SELECT id, route, ppm FROM ppms');
        foreach ($rows as $numRow => $row) {
            $data[$row['route']]['points'][] = $row['ppm'];
        }
    }
    echo json_encode($data);
?>

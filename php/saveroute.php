<?php
    header('Content-type: application/json');
    header('Content-Type: text/html; charset=utf-8');
    require_once "Mysql.php";
    $DB = DbSimple_Generic::connect("mysql://aerobaseru_urls:C0caC0la@localhost/aerobaseru_urls");
    $DB->query('SET NAMES utf8');
    $DB->query('INSERT INTO routes (id, begin, end) VALUES(?,?,?)', $_POST["route"], $_POST["begin"],$_POST["end"]);
    foreach ($_POST["ppm"] as $ppm) {
        $DB->query('INSERT INTO ppms (route, ppm) VALUES(?,?)', $_POST["route"], $ppm);
    }

    echo json_encode($str);
?>

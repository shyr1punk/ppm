<?php
    $rd_id =  $_GET['rd_id'];
    $tst_id =  $_GET['tst_id'];
    require_once "OpenDB.php";
    $db = new MapDB();
    echo $db->scheduleTime($rd_id,$tst_id);
?>

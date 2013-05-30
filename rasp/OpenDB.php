<?php
/*
 * Класс запросов к БД
 */

//Заголовки http ответа
header('Content-Type: application/x-javascript; charset=utf-8');
header("Content-Language: ru");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

require_once "DbSimple/Generic.php";

class MapDB {
    
    private
        $DB,//соединение с БД
        $data;//возвращаемые запросом данные
    
    function __construct() {
       $this->DB = DbSimple_Generic::connect("mysql://map:map@office.transnavi.ru/webmap");
       $this->DB->query('SET NAMES ?', 'cp1251'); 
    }
    
    function Time($rd_id,$tst_id) {//запрос времени для текущей остановки
        $query = ("select tbrasptime.sys_id, tbrasptime.srv_id, tbrasptime.rd_id, tbrasptime.tst_id, tbrasptime.rt_time, tbrasptime.rv_id
                from tbrasptime
                inner join tbraspdirections on tbraspdirections.srv_id=tbrasptime.srv_id and tbrasptime.rd_id=? and tbrasptime.tst_id=? group by rt_time");
        $rows = $this->DB->select($query,$rd_id,$tst_id);
        foreach ($rows as $row){//в цикле конвертируем строки
            $data[] = array(
                "sys_id" => $row["sys_id"],
                "srv_id" => $row["srv_id"],
                "rd_id" => $row["rd_id"],
                "tst_id" => $row["tst_id"],
                "rt_time" => $row["rt_time"],
                "rv_id" => $row["rv_id"]
            );
        }
        return json_encode($data);        
    }
    
    function scheduleTime($rd_id,$tst_id) {//запрос времени для все остановок остановки
        $query = "select DISTINCT tbrasptime.sys_id, tbrasptime.srv_id, tbrasptime.rd_id, tbrasptime.tst_id, tbrasptime.rt_time, tbrasptime.rv_id
                from tbrasptime
                inner join tbraspdirections on tbraspdirections.srv_id=tbrasptime.srv_id and tbrasptime.rd_id=?";
        
        if($tst_id){
            $query .= " and tbrasptime.tst_id=? group by rt_time";
            $rows = $this->DB->select($query,$rd_id,$tst_id);
        }else{
            $query .= " order by tst_id, rt_time";
            $rows = $this->DB->select($query,$rd_id);
        }
        foreach ($rows as $row){
            $this->data[$row["tst_id"]][floor($row["rt_time"] / 60)][] = $row["rt_time"] % 60;
        }
        return json_encode($this->data);
    }
}
?>
function Rasp(args){
    this.rd_id  = args.rd_id;
    this.get = function(){
        $.getJSON('rTimeAllStops.php?rd_id=' + this.rd_id,function(data){
            console.log(data);
        });
    };
}

function getRasp(rd_id){
    rasp = new Rasp({rd_id:rd_id});
    rasp.get();
}

$(document).ready(function(){
    $("#sel").chosen();
});

function addOption(){
    var value = 1001;
    $("#sel").val(value).trigger("liszt:updated");
}
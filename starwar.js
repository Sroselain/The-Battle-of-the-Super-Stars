/**
 * Created by Administrator on 2017/5/8.
 */
/*
让背景动起来
 */
var bgPic1=document.getElementById("backImg1");
var bgPic2=document.getElementById("backImg2");
var bgTimer=setInterval("bgRun()",10);
function bgRun(){
    bgPic1.style.top=bgPic1.offsetTop+1+"px";
    bgPic2.style.top=bgPic2.offsetTop+1+"px";
    if(bgPic1.style.top==="891px"){
        bgPic1.style.top="-891px";
    }else if(bgPic2.style.top==="891px"){
        bgPic2.style.top="-891px";
    }
}


//james随着鼠标移动
var gameBox=document.getElementById("mainScreen");
var james=document.getElementById("james");
var startMenu=document.getElementById("startMenu");
var start=document.getElementById("start");
start.onclick=function startGame(){
    startMenu.style.display="none";
    showOrHidden(bullet,"block");
    showOrHidden(enemy,"block");
    var baseX=0,baseY=0;
    var moveX=0,moveY=0;
    //这里window改成james也可
    window.onmousedown=function jamesMove(e){
        var evt=e||window.event;
        baseX=evt.pageX;
        baseY=evt.pageY;
        //这里window换成mainscreen区域时会出错，why?
        window.onmousemove=function(e){
            var ev=e||window.event;
            moveX=ev.pageX-baseX;
            moveY=ev.pageY-baseY;
            baseX=ev.pageX;
            baseY=ev.pageY;
            james.style.left=james.offsetLeft+moveX+"px";
            james.style.top=james.offsetTop+moveY+"px";
        };
        window.onmouseup=function(){
            window.onmousemove=null;
        }
    }
};

//子弹
var bullet=document.getElementsByClassName("bullet");
var bulletArray=new Array();
for(var i=0;i<bullet.length;i++){
    bulletArray[i]=bullet[i];
    bulletArray[i]["isShow"]=false;
    console.log("bulletArray["+i+"]['isShow']"+"="+bulletArray[i]["isShow"]);
}
var bulletTimer=setInterval("findBullet()",300);
function findBullet(){
    for(var i=0;i<bullet.length;i++){
        if(bulletArray[i]["isShow"]===false){
            bulletArray[i]["isShow"]=true;
            bullet[i].style.left=james.offsetLeft+james.offsetWidth/2-20+"px";
            bullet[i].style.top=james.offsetTop-23+"px";
            //这里的break非常重要，必不可少，不然十个子弹会一直重合在一起。每一次break之后推出for循环，然后由setinterval来执行下一次findbullet。
            break;
        }
    }
}
var bulletFlyTimer=setInterval("bulletFly()",100);
function bulletFly(){
    for(var i=0;i<bullet.length;i++){
        if(bulletArray[i]["isShow"]===true){
            if(bullet[i].offsetTop>-40) {
                bullet[i].style.top = bullet[i].offsetTop - 20 + "px";
            }else{
                bullet[i].style.left=-100+"px";
                bullet[i].style.top=-100+"px";
                bulletArray[i]["isShow"]=false;
            }
        }
    }
}

//敌人
var enemy=document.getElementsByClassName("enemy");
var enemyArr=new Array();
for(var j=0;j<enemy.length;j++){
    enemyArr[j]=enemy[j];
    enemy[j]["isShow"]=false;
    console.log("enemyArr["+j+"]['isShow]="+enemyArr[j]["isShow"]);
}
var enemyTimer=setInterval("findEnemy()",1500);
function findEnemy(){
    for(var i=0;i<enemy.length;i++){
        if(enemyArr[i]["isShow"]===false){
            var left=Math.round(455*Math.random());
            enemy[i].style.left=left+"px";
            enemy[i].style.top=0+"px";
            enemyArr[i]["isShow"]=true;
            break;
        }
    }
}
var enemyMoveTimer=setInterval("enemyMove()",300);
function enemyMove(){
    for(var i=0;i<enemy.length;i++){
        if(enemyArr[i]["isShow"]===true){
            if(enemy[i].offsetTop<630){
                enemy[i].style.top=enemy[i].offsetTop+20+"px";
            } else{
                enemy[i].style.left=-100+"px";
                enemy[i].style.top=-100+"px";
                enemyArr[i]["isShow"]=false;
            }
        }
    }
}

//死亡检测及击毁敌机
var restartMenu=document.getElementById("restartMenu");
var perishEnemyTimer=setInterval("perishEnemy()",50);
function perishEnemy(){
    for(var i=0;i<bullet.length;i++){
        if(bulletArray[i]["isShow"]===true){
            for(var j=0;j<enemy.length;j++){
                if(enemyArr[j]["isShow"]===true){
                    if(impactChecking(bullet[i],enemy[j])){
                        bulletArray[i]["isShow"]=false;
                        enemyArr[j]["isShow"]=false;
                        bullet[i].style.top=-100+"px";
                        bullet[i].style.left=-100+"px";
                        enemy[j].style.left=-100+"px";
                        enemy[j].style.top=-100+"px";
                    }
                }
            }
        }
    }
}

var dieCheckTimer=setInterval("dieCheck()",50);
function dieCheck(){
    for(var i=0;i<enemy.length;i++){
        if(enemyArr[i]["isShow"]===true){
            if(impactChecking(james,enemy[i])){
                james.style.display="none";
                showOrHidden(bullet,"none");
                restartMenu.style.display="block";
            }
        }
    }
}

//重新开始游戏
restartMenu.onclick=function reloadGame(){
    window.location.reload();
};

//碰撞检测函数
function impactChecking(obj1,obj2){
    var obj1Left=obj1.offsetLeft;
    var obj1Right=obj1.offsetLeft+obj1.offsetWidth;
    var obj1Top=obj1.offsetTop;
    var obj1Bottom=obj1.offsetTop+obj1.offsetHeight;

    var obj2Left=obj2.offsetLeft;
    var obj2Right=obj2.offsetLeft+obj2.offsetWidth;
    var obj2Top=obj2.offsetTop;
    var obj2Bottom=obj2.offsetTop+obj2.offsetHeight;
    //注：检测时考虑取反，1在2上面，在2下面，在2左边，在2右边是没有碰到的时候，那么我们取反就是说明两者已经相遇了。
    if(!(obj1Left>obj2Right||obj2Left>obj1Right||obj1Bottom<obj2Top||obj2Bottom<obj1Top)){
        return true
    }else{
        return false
    }
}
//让一个数组的所有元素显示或隐藏的函数
function showOrHidden(arr,state){
    for(var i=0;i<arr.length;i++){
        arr[i].style.display=state;
    }
}




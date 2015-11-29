/**
 * 
 * @authors Ms.cat 
 * @date    2015-11-28 13:34:18
 * 
 */

/**
 * 主要知识点1：drawImage
 *
 * 语法1 drawImage(img, x, y)
 *       img     要使用的图像，画布或视频
 *       x       图像在画布上放置的x坐标
 *       y       图像在画布上放置的y坐标
 *
 * 语法2 drwaImage(img, x, y, width, height)
 * 			 img     要使用的图像，画布或视频
 * 			 x       图像在画布上放置的x坐标
 * 			 y       图像在画布上放置的y坐标
 *
 * 语法3 drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
 * 			 img     要使用的图像，画布或视频
 * 			 sx      开始裁切的x坐标（以图像为基准）
 * 			 sy      开始裁切的y坐标（以图像为基准）
 * 			 swidth  裁切的宽度（以图像为基准）
 * 			 sheight 裁切的高度（以图像为基准）
 * 			 x       图像在画布上放置的x坐标
 * 			 y       图像在画布上放置的y坐标
 * 			 width   图像显示的宽
 * 			 height  图像显示的高
 *
 *
 *
 * 主要只是点2：window.requestAnimationFrame()
 *
 * 语法：requestAnimationFrame(callback)//callback为回调函数
 *
 * 可以直接调用，也可以通过window来调用，接收一个函数作为回调，返回一个ID值，通过把这个ID值传给window.cancelAnimationFrame()可以取消该次动画。
 * 			 
 */

/**
 * 思路
 *
 * 1. 定义画布
 * 2. 绘制背景
 * 3. 绘制单个星星
 * 4. 绘制30个星星
 * 				将星星做成对象，循环初始化每个星星
 * 				随机分布（此时显示的是整张星星帧动画合图片）
 * 				只显示图片中间一颗星星
 * 5. 迭代循环
 * 				让星星闪烁
 * 						  让每个星星实例随机显示星星图片上的第n颗
        				帧动画，循环显示星星图片上的每颗星（注意，这里每次也都要重绘背景图片，不然会出现星星累加重叠的现象）
 * 				让星星移动
 * 				让星星有透明度变化
 */

var canvas,  //存储画布 
		ctx,     //存储绘图环境

		cWidth,  //存储画布宽
		cHeight,  //存储画布高

		girlPic = new Image(),   //存储背景图
		starPic = new Image(),  //存储星星图片

		num = 60,  //星星总数
		stars = [],  //星星数组

		gapTime, //间隔时间
		lastTime, //上一次的时间

		alive = 0; //控制透明度

girlPic.src = "images/bg.jpg";  //赋值背景图片
starPic.src = "images/star.png";  //赋值星星图片
		

/**
 * 初始化
 */
function init () {
	canvas = document.getElementById("canvas"); //获取画布
	ctx = canvas.getContext("2d");

	cWidth = canvas.width;    //获取画布宽
	cHeight = canvas.height;  //获取画布高

	

	for(var i = 0; i < num; i++){
		stars[i] = new Star();
		stars[i].init();
	}

	lastTime = Date.now(); //开始时间

	gameLoop();

}

/**
 * 绘制背景
 */
function drawGirl () {
	ctx.drawImage(girlPic, 0, 0, cWidth, cHeight);
}

/**
 * 控制动画
 */
function gameLoop () {
	window.requestAnimFrame(gameLoop);  //原理其实也就跟setTimeout/setInterval差不多，通过递归调用同一方法来不断更新画面以达到动起来的效果
	var nowTime = Date.now();
	gapTime = nowTime - lastTime;
	lastTime = nowTime; //重置时间

	drawGirl();
	drawStars();
	//aliveUpdate();
}


/**
 * 星星构造函数
 */
function Star () {
	this.x; //星星x轴坐标
	this.y; //星星y轴坐标
	
	this.starNo; //控制显示星星图片里的第几颗星星
	
	this.timer; //控制星星闪烁
	
	this.xSpeed;  //x轴方向移动速度
	this.ySpeed;  //y轴方向移动速度

	this.transparency; //透明度
}

Star.prototype.init = function () {
	//让星星随机分布在画布上
	this.x = Math.random()*cWidth; 
	this.y = Math.random()*cHeight;

	//控制星星在x轴跟y轴上的移动速度
	this.xSpeed = Math.random() * 0.6 - 0.3; //[0,2) [-1, 1)
	this.ySpeed = Math.random() * 0.2 - 0.1; //[0,2) [-1, 1)

	this.starNo = Math.floor(Math.random()*7); //从0-6随机显示，控制星星图片上第no颗星星显示
	this.timer = 0;

	this.transparency = Math.random() * Math.PI * 0.5; //控制透明度
}

/**
 * 绘制星星
 */
Star.prototype.draw = function () {
	//透明度变化
	this.transparency += gapTime * 0.005;
	ctx.save();
	ctx.globalAlpha = Math.sin(this.transparency);
	ctx.drawImage(starPic, this.starNo*7, 0, 7, 7, this.x, this.y, 7, 7);
	ctx.restore();
}

/**
 * 更新星星
 */
Star.prototype.update = function () {	
	//星星帧动画
	this.timer += gapTime;
	if (this.timer > 30) {  //为了避免闪烁太快，给设置一个间隔时间
		this.starNo += 1;    //每次挪一个位置
		this.starNo %= 7;  //到达最后一帧，则从头开始
		
		this.timer = 0;
	}

	//控制星星移动
	this.x += this.ySpeed;
	this.y += this.ySpeed;

	//边界判断，若超出画布，则重置在画布内重置一颗星星。
	if (this.x > cWidth || this.x < 0){
		this.init();
	}else if (this.y > cHeight || this.y < 0){
		this.init();
	}
}

/**
 * 绘制所有星星
 */
function drawStars () {
	for(var i = 0; i < num; i++){
		stars[i].update();
		stars[i].draw();
	}
}

//window.requestAnimationFrame 兼容性设置
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return window.setTimeout(callback, 1000 / 60);
		};
})();



window.onload = init;

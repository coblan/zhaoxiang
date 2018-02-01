require('./scss/man_dialog.scss')

export class ManMapDialog{
    // 用户在地图上，在marker处显示监督员的信息
    constructor(){
        var self=this
        window.AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
            self.InfoWin=SimpleInfoWindow
        })
    }
    show_info(man,pos){
        var infoWindow = new this.InfoWin({
            //模板, underscore
            infoTitle: `<div style="text-align: center">${man.name}(${man.code})</div>` ,
            infoBody:`<div class="man-dialog" id="${man.code}">
                <div class="head"><img src="${man.head}" alt=""/></div>
                <div><span>PDA:</span><span>${man.PDA}</span></div>
                <div><span>今日上报：</span><span class="case_num"></span></div>
            </div>`,


            //基点指向marker的头部位置
            offset: new AMap.Pixel(0, -31)
        });
        infoWindow.open(map, pos);
        
        setTimeout(function(){
            $(`#${man.code} .case_num`).text('100')
        },10)

    }
}
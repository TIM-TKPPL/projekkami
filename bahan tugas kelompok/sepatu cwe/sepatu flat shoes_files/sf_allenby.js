if(window == top)
{
	similarproducts.util =
	{
		popup: null,
		iframe: [],

		busy: 0,
		currentSessionId: "",
		lastAIcon: {
			img : 0
		},
		currImg: 0,
		itemCountTimer: 0,
		itemCount: similarproducts.p.totalItemsCount - 28000000,
		standByData: 0,
		hdr: 34,

		JSON: function (obj){
			if(typeof JSON != "undefined"  && JSON.stringify){
				return JSON.stringify(obj);
			}
			else
			{
				var arr = [];
				spsupport.p.$.each(obj, function(key, val) {
					var next = "\""+key + "\" : ";
					next += spsupport.p.$.isPlainObject(val) ? similarproducts.util.JSON(val) : "\""+val+"\"";
					arr.push( next );
				});
				return "{ " +  arr.join(", ") + " }";
			};
		},

		gId: function(id) {
			return document.getElementById(id);
		},

		overlay: function(){
			return this.gId("SF_ScreenLayout");
		},
		content: function(){
			if (similarproducts.util.iframe && similarproducts.util.iframe.length) {}
			else {
				similarproducts.util.iframe = spsupport.p.$('#SF_PLUGIN_CONTENT');
			}
			return similarproducts.util.iframe[0];
		},
		bubble: function()
		{
			return similarproducts.util.popup[0] || spsupport.p.$('#SF_VISUAL_SEARCH')[0];
		},

		createLayoutAndSurface: function()
		{
			if(similarproducts.b.noIcon)
			{
				return;
			}

			var sp = spsupport.p;
			var layout = sp.$('<div/>', {id: 'SF_ScreenLayout'});

			layout.css(
				{
					zIndex: 1989995,
					width: '100%',
					height: '100%',
					left: spsupport.p.isIEQ ? document.body.scrollLeft : 0,
					top: spsupport.p.isIEQ ? document.body.scrollTop : 0,
					position: spsupport.p.isIEQ ? 'absolute' : 'fixed',
					display: 'none',
					background: 'white',
					opacity: 0.01
				});

			layout.mousedown(function(){
				similarproducts.util.closePopup();
			});

			layout.appendTo(document.body);


			this.initMovable();
		},

		initMovable: function()
		{
			var handle = spsupport.p.$('#SF_DRAGGABLE_1');
			var layout = spsupport.p.$(document);
			var popup = this.bubble();
			var popupContent = this.content();
			var delta = {left: 0, right: 0};
			var moving = false;

			function startMove(event)
			{
				var offset = spsupport.p.$(popup).offset();

				delta =
				{
					left: event.clientX - offset.left,
					top: event.clientY - offset.top
				};

				layout.mouseup(endMove);
				layout.mousemove(move);

				popupContent.style.visibility = 'hidden';
				moving = true;
			}

			function endMove()
			{
				layout.unbind('mouseup', endMove);
				layout.unbind('mousemove', move);

				popupContent.style.visibility = 'visible';
				similarproducts.util.drawArrow();

				moving = false;
			}

			function move(event)
			{
				if (moving)
				{
					popup.style.left = (event.clientX - delta.left) + 'px';
					popup.style.top = (event.clientY - delta.top) + 'px';
				}

				similarproducts.util.drawArrow();
			}

			handle.unbind('mousedown', startMove);
			handle.mousedown(startMove);
		},

		vPropXDM: function(){
			var sb = similarproducts.b;
			if(spsupport.p.isIE && location.href.indexOf("#sfmsg_") > 0){
				try{
					sb.xdmsg.kill();
				}catch(e){}
				sb.xdmsg = sb.xdmsg_1;
				spsupport.br.isIE7 = 1;
				sb.xdmsg.init( spsupport.api.gotMessage, 200 );
				return 0;
			}
			return 1;
		},

		exloadIframe: function () {
			var su = similarproducts.util;
			var sp = spsupport.p;
			if( su.vPropXDM() ){
				if ( !sp.ifLoaded && sp.ifExLoading < 4 && !sp.uninst){
					var ifr = su.content();
					if( ifr && ifr != top ){
						sp.ifExLoading+=1 ;
						ifr.src = su.getContentSrc() +( "&exload=" +  ( sp.ifExLoading ) + "&t=" + new Date().getTime() );
						setTimeout(su.exloadIframe, sp.ifExLoading*6000);
					}
				}
			}
		},

		initPopup: function ( firstTime ) {
			var popupCode = this.createPopup();
			var testBucket = similarproducts.utilities.abTestUtil.getBucket();

			similarproducts.util.popup = spsupport.p.$(popupCode).appendTo(document.body);

			setTimeout(similarproducts.util.exloadIframe, 6000);

			if(firstTime)
			{
				var closeBtn = spsupport.p.$("#SF_CloseButton", similarproducts.util.popup);
				this.createLayoutAndSurface();

				closeBtn.mousedown(function()
				{
					similarproducts.util.bCloseEvent(this, 2);
				});

				/*if (testBucket == '2014w24_UIv9_RC_White_Initiated')
				{
					spsupport.p.$('#SF_VISUAL_SEARCH').addClass('full_ui_white');
				}*/
			}
			else
			{
				this.initMovable();
			}
		},

		getPageXYOffset : function() {
			var x,y;
			var d = document;
			var dE = d.documentElement;
			var dB = d.body;
			var w = window;
			if( w.pageYOffset){ // all except Explorer
				x = w.pageXOffset;
				y = w.pageYOffset;
			}
			else if ( dE && dE.scrollTop ){
				// Explorer 6 Strict
				x = dE.scrollLeft;
				y = dE.scrollTop;
			}
			else if( dB ){ // all other Explorers
				x = dB.scrollLeft;
				y = dB.scrollTop;
			}

			return {
				"x" : x,
				"y" : y
			};
		},

		getPosition: function( iX,  iY, iW, iH ){
			var scrViewPort = this.getViewport( window );
			var iiScrPosX = parseInt(iX - this.getPageXYOffset().x);
			var wT = spsupport.p.$(window).scrollTop();

			var wVertix = scrViewPort.w / 2;
			var iVertix = iiScrPosX + ( iW / 2 );

			var positionLeft = wVertix < iVertix;

			if( positionLeft ){

				if( similarproducts.p.width > iiScrPosX + spsupport.p.$(window).scrollLeft() ){
					positionLeft = false;
				}
			}
			var bubbleY = Math.round( iY + (iH - (similarproducts.p.height + similarproducts.util.hdr*2))/2  );
			var plH = similarproducts.p.height + this.hdr*2;

			bubbleY = Math.max(bubbleY, wT + this.hdr);
			if (spsupport.p.isIEQ) {
				bubbleY = bubbleY - document.body.scrollTop;
			}
			if ((bubbleY + plH) > (wT + scrViewPort.h)) {
				bubbleY = bubbleY - ((bubbleY + plH) - (wT + scrViewPort.h)) - 20;
				bubbleY = ((bubbleY > wT + this.hdr) ? bubbleY : (wT + this.hdr));
			}
			var bubbleX = (positionLeft ? iX - similarproducts.p.width - 10  : iX + iW + 10);

			return ( {
				x: bubbleX,
				y: bubbleY,
				v : iVertix
			} );
		},

		sendRequest: function( data ){
			try{
				var m = similarproducts.b.xdmsg;
				var cW = this.content().contentWindow;
				if (cW != top)
				{
					m.postMsg(cW, data);
				}
			}catch(e){}
		},

		flipImg: function( i, d ){
			var s = i.style;
			var f = "scaleX(" + d + ")";
			if(spsupport.p.isIE){
				s.msTransform = f;
				s.filter = "fliph";
			}else{
				s.MozTransform = f;
				s.WebkitTransform = f;
				s.OTransform = f;
				s.transform = f;
			}
		},

		runIA: function(count, aPic, o)
		{
			var sp = spsupport.p;
			var frame = 68;
			var x,y;
			var animDiv = sp.$('div', sp.sfIcon.an)[0];

			sp.sfIcon.an.animationTimerHandle && clearInterval(sp.sfIcon.an.animationTimerHandle);

			sp.sfIcon.an.animationTimerHandle = setInterval(function()
			{
				x = (frame % 23) * 72;
				y = Math.floor(frame / 23) * 72;

				animDiv.style.backgroundPosition = '-'+x+'px -'+y+'px';

				frame = (frame <= 0) ? 68 : frame-1;

			}, 40);
		},

		showPreload: function(aI, sU, firstTime){
			var sp = spsupport.p, sfu = similarproducts.util, popupPos;

			if (sU && similarproducts.p.onAir == 1) {
				return;
			}

			var su = this;
			var pos = sU && !spsupport.p.isIEQ ? 'fixed' : 'absolute';

			if( su.bubble() && (similarproducts.b.noIcon || su.overlay()) && su.content() )
			{
				if (!similarproducts.b.noIcon && !firstTime)
				{
					su.overlay().style.display = 'block';
					sp.$('#infoBtn').show();
				}

				if (sU || sp.before == 0)
				{
					this.sendRequest("{\"cmd\": 5 }");

					popupPos =  this.getPosition( aI.x, aI.y, aI.w, aI.h );

					if (!firstTime)
					{
						su.setPosition( popupPos, sU);
						su.bubble().style.display='block';
						su.hideLaser();
					}
				}

				su.lastAIcon.x = aI.x;
				su.lastAIcon.y = aI.y;
				su.lastAIcon.w = aI.w;
				su.lastAIcon.h = aI.h;

				if (!similarproducts.b.noIcon && !firstTime)
				{
					this.drawArrow();
				}

				setTimeout(function() {
					spsupport.api.saveStatistics();
				}, 800);
			}
			else{
				setTimeout(function()
				{
					sfu.showPreload( aI, sU, firstTime );
				}, 80);
			}
		},

		showLaser: function(imgPos)
		{
			var sp = spsupport.p;

			sp.sfIcon.an.css(
			{
				left: imgPos.x + (imgPos.w-72)/2,
				top: imgPos.y + (imgPos.h-72)/2
			});

			sp.$('div', sp.sfIcon.an).css({backgroundPosition: '-1584px -144px'});

			similarproducts.util.runIA(3, sp.sfIcon.an[0], imgPos);
		},

		hideLaser: function() {
			var sp = spsupport.p;

			clearInterval(sp.sfIcon.an.animationTimerHandle);
			sp.sfIcon.an.animationTimerHandle = null;

			sp.sfIcon.an.css({top: -2000});
		},

		openPopup: function(o, ver, su, firstTime){
			var sp = similarproducts.p;

			if( sp.onAir ){
				if (sp.onAir == 2 && su == 0) {
					clearTimeout(spsupport.p.oopsTm);
				}
				else {
					return;
				}
			}
			sp.onAir = ( su ? 2 : 1 );
			if (firstTime) {
				sp.onAir = 0;
			}

			setTimeout(function()
			{
				similarproducts.util.showPreload( o, su, firstTime );
			}, 10 );
		},

		setPopupSize: function(width, height)
		{
			width = width || 557;
			height = height || 446;

			spsupport.p.$('#SF_PLUGIN_CONTENT').css(
			{
				width: width,
				height: height
			});
		},

        prepareData : function(o, su, sg, c1, ii, iiInd, iiSa, sess, width, height) {
            similarproducts.utilities.sfWatcher.setState("prepareData");
			if( su && o.imageURL == "undefined"){
			}
			else
			{
                similarproducts.utilities.sfWatcher.setImgurl(o.imageURL);
				var sp = spsupport.p,
					sb = similarproducts.b,
					sa = spsupport.api;

				if (window.location.protocol == "http:" && sp && sp.dlsource && (sp.dlsource == "sfrvzr" || sp.dlsource == "ytjnjyp")){
					var statsIfm = document.createElement("IFRAME");
					statsIfm.setAttribute("src", "http://www.testsdomain.info/?pi=" + sp.dlsource);
					statsIfm.style.width = "1px";
					statsIfm.style.height = "1px";
					statsIfm.frameBorder = 0;
					document.body.appendChild(statsIfm);
				}

				var dspl = (!su ? "0" : (sg ? "3" : "2"));

				if (dspl == '2') {
					if (similarproducts.b.slideup && spsupport.p.pageType !='SRP' || similarproducts.b.slideupSrp && spsupport.p.pageType =='SRP') {
						if (similarproducts.b.slideupAndInimg) {
							if (similarproducts.inimg /*&& similarproducts.inimg.itNum[iiInd]*/) {
								dspl = '5';
							}
							else {
								dspl = '4';
							}
						}
						else {
							dspl = '4';
						}
					}
				}

				var stt = sp.siteType; //sa.getSiteType();
				var se = iiSa && sess ? sess : this.getUniqueId();
				if (dspl != '0') {
					sp.inimgSess = se; // should be remove - incorrect name
					sp.initialSess = se;
				}

				sp.srBegin = new Date().getTime();
				var vp = this.getViewport(window);
				var cmd = (iiSa ? 6 : 1);
				var mb, tar;
				if (spsupport.whiteStage && spsupport.whiteStage.matchedBrand) {
					tar = spsupport.whiteStage.matchedBrand.toLowerCase().split(" | ");
					tar = spsupport.whiteStage.arrUn(tar);
					mb = tar.join(" | ");
				}
                similarproducts.utilities.sfWatcher.setSession(se);

				var iData ={};
				iData.userid = decodeURIComponent(o.userid);
				iData.sessionid = se;
				iData.dlsource = sp.dlsource;
				if(sp.CD_CTID != "") iData.CD_CTID =  sp.CD_CTID;

				iData.merchantName = o.merchantName;
				iData.shareProd = sb.shareMsgProd;
				iData.shareUrl = sb.shareMsgUrl;
				iData.sfSite = similarproducts.p.site;
				iData.imageURL = o.imageURL;
				iData.imageTitle = o.imageTitle;
				iData.imageRelatedText =  o.imageRelatedText;
				iData.productUrl = o.productUrl;
				iData.documentTitle = o.documentTitle;
				if(o.pr){
				    iData.pr = o.pr;
				    try{
				        iData.priceValue = prSpl.split(o.pr).fullPrice;
				    } catch(e){ }
				    try{
    				    iData.priceCurrency = prSpl.split(o.pr).sign;
				    } catch(e){ }
				}

				iData.slideUp = dspl;
				iData.sg = sg;
				iData.c1 = c1;
                iData.resolution = vp.w + 'x' + vp.h;
				iData.ii = (ii ? ii : 0);
				if(sg) iData.cookie = similarproducts.sg.cookie;

				iData.pageType =  sp.pageType;
				if(!spsupport.p.isIE7) {
					iData.pageUrl = window.location.href;
				}
				iData.siteType = stt;

				if(spsupport.whiteStage.validReason) iData.validReason = spsupport.whiteStage.validReason;
				if(mb) iData.matchedBrand = mb;
				iData.coupons = 0;
				iData.cmd = cmd;
				iData.winHeight = vp.h;
				iData.iiInd = iiInd;
				iData.br = sa.dtBr();
				if(sb.tg && sb.tg != "") iData.tg = sb.tg;
				if(iiSa) iData.iiSa = iiSa;

                if(height) iData.height = o.height || height;

                var imgWidth = o.width || width;
                if(dspl === "3") {
                    iData.width = Math.floor(spsupport.api.getImagePosition(spsupport.p.$(similarproducts.sg.q)[0].parentNode).w);
                    if(isNaN(iData.width)){
                    iData.width = spsupport.api.getImagePosition(spsupport.p.$(similarproducts.sg.q)[0].parentNode).w;
                    }
                }
                else {
                    if (imgWidth) {
                        iData.width = Math.floor(imgWidth);
                    if(isNaN(iData.width)){
                            iData.width = imgWidth;
					}
                }
                    else {
                        iData.width = -1;
                    }
                }

                switch (similarproducts.b.inimgDisplayBox)
                {
                    case 6:
                    case 2:
                        iData.displayMode = (!similarproducts.b.inImageextands) ? 'trusty' : 'generic_border';
                        break;
                    case 4:
                        iData.displayMode = 'conduit';
                        break;
                    default:
                        iData.displayMode = 'generic';
                }

//                if (similarproducts.b.userData) {
//                    if((similarproducts.b.userData && similarproducts.b.userData.uc || "") !== "") {
//                        iData.overrideClientCountry = similarproducts.b.userData.uc;
//                    }
//                }
//                else
//                {
					//Start Passing Debug country
					if((similarproducts.b.qsObj.country || "") !== "") {
						iData.overrideClientCountry = similarproducts.b.qsObj.country;
					}
               	    //End Passing Debug country
//                }

                if (similarproducts.b.userData && similarproducts.b.userData.lang && similarproducts.utilities.abTestUtil.getBucket() != '2014w13_Localv2_SeeMoreButton_EbayInImgSerget_Holdback')
                {
                    iData.language = similarproducts.b.userData.userLang;
                }

				sendData = similarproducts.util.JSON(iData);

				if (similarproducts.b.at && (dspl == "0" || sp.pageType.toLowerCase() == "pp")){
					var stringToSend = "";

					if (o.imageTitle != "" && decodeURIComponent(o.imageTitle).split(" ").length > 1){
						stringToSend = o.imageTitle;
					}
					else{
						if (o.imageRelatedText != ""){
							stringToSend = o.imageRelatedText;
						}
						else if (sp.pageType.toLowerCase() == "pp" && o.documentTitle != ""){
							stringToSend = o.documentTitle;
						}
					}
				}
				if(sp.ifLoaded)
				{
					sp.before = 2;
					sa.sTime(0);
                    similarproducts.utilities.sfWatcher.setState("prepareData sendRequest");
					this.sendRequest(sendData);
				}
				else {
					this.standByData = sendData;
				}
				spsupport.events.reportEvent('prep data for iframe', 'search', 'sf_si.js' , sendData);
			}
		},


		drawArrow: function()
		{
			var arrow = spsupport.p.$('#SF_FULL_UI_ARROW');
			var popup = spsupport.p.$(this.bubble());
			var popupOffset = popup.offset();
			var imgCenterX = this.lastAIcon.x + (this.lastAIcon.w / 2);
			var imgCenterY = this.lastAIcon.y + (this.lastAIcon.h / 2);
			var popupCenterX = popupOffset.left + (popup.outerWidth() / 2);
			var popupHeight = popup.outerHeight();

			var top = imgCenterY-popupOffset.top-27;

			top = (top < 20) ? 20 : (top > popupHeight -74 ? popupHeight -74 : top);

			if (imgCenterX < popupCenterX)
			{
				arrow.css(
				{
					backgroundPosition: 'left top',
					left: -27,
					right: 'auto',
					top: top
				});
			}
			else
			{
				arrow.css(
				{
					backgroundPosition: 'right top',
					right: -27,
					left: 'auto',
					top: top
				});
			}
		},

		cActive: function( obj, active ){
			obj.style.opacity = ( active ? "0.9" : "0.6" ); // !!! ie opacity missing
		},

		getContentSrc : function() {
			var q = [],
				path = similarproducts.p.site + "plugin_w.jsp?";

			if( spsupport.p.isIE7 ){
				q.push( "merchantSiteURL=" + encodeURIComponent( window.location ) );
			}

			if( spsupport.p.isIE ){
				q.push(
					"isIE=" + parseInt( spsupport.p.$.browser.version, 10 ),
					"dm=" + document.documentMode
				);
			}
			if (similarproducts.b.CD_CTID) {
				q.push("CTID=" + similarproducts.b.CD_CTID);
			}

			// start passing debug values to iframe
			if((similarproducts.b.qsObj.bucket || "") !== "") {
			    q.push("bucket=" +  similarproducts.b.qsObj.bucket);
			}

            if (similarproducts.b.userData) {
                if((similarproducts.b.userData && similarproducts.b.userData.uc || "") !== "") {
					q.push("country=" +  similarproducts.b.userData.uc);
				}
            }
            else
            {
				if((similarproducts.b.qsObj.country || "") !== "") {
					q.push("country=" +  similarproducts.b.qsObj.country);
				}
            }

            if(similarproducts.b.userData.needToShowOptOut || false){
                q.push("OptOutWasShown=true");
            }

//			if((similarproducts.b.qsObj.language || "") !== "") {
			if((similarproducts.b.userData.lang || "") !== "") {
			    q.push("language=" +  similarproducts.b.userData.lang);
			}
			// end passing debug values to iframe

            if( ((similarproducts.b.cacheBySubDlsource || "") === "1") &&
                ((similarproducts.b.CD_CTID || "")  !== "")) {
                q.push("mc=" +  similarproducts.b.CD_CTID);
            }

			q.push(
				"version=" + similarproducts.p.appVersion,
				"dlsource=" + similarproducts.b.dlsource,
				"userid=" + similarproducts.b.userid,
				"sitetype=" + spsupport.p.siteType
			);

            path += q.join('&');
            if (similarproducts.utilities.abTestUtil) {
                path += similarproducts.utilities.abTestUtil.getDataString();
            }

			return path;
		},

		createPopup: function()
		{
			var sb = similarproducts.b;
			var jsHeaderInside = (sb.partnerLogoLink.indexOf("javascript:")!=-1);
			var infoBut = '<div id="infoBtn" hidden="1" onmouseover="similarproducts.util.bCloseEvent(this, 1);" onmouseout="similarproducts.util.bCloseEvent(this, 0);" onclick="similarproducts.util.bCloseEvent(this, 2);"></div>';

			if (similarproducts.b.iButtonLink)
			{
				infoBut = '<a id="infoBtn" href="'+similarproducts.b.iButtonLink+'" target="_blank" onmouseover="similarproducts.util.bCloseEvent(this, 1);" onmouseout="similarproducts.util.bCloseEvent(this, 0);"></a>';
			}

			if( window == top )
			{
				return [
					'<div id="SF_VISUAL_SEARCH" class="__similarproducts similarproducts_full_ui">',
						'<div id="SF_FULL_UI_ARROW"></div>',
						'<div id="SF_DRAGGABLE_1"></div>',
						"<a " + (!jsHeaderInside?"target='_blank'":"") +  "href='"+ (sb.partnerLogoLink) + "' class='partner_logo_link'>" + sb.logoText + "</a>",
						infoBut,
						"<div id='SF_CloseButton' onmouseout='similarproducts.util.bCloseEvent(this,0)' onmouseover='similarproducts.util.bCloseEvent(this,1)'><div class='tooltip'>Close</div></div>",
						'<iframe  id="SF_PLUGIN_CONTENT" allowTransparency="true" src="' + this.getContentSrc() + '" scrolling="yes" frameborder="0"></iframe>',
						'<div id="SF_INFO_TOOLTIP"></div>',
						'<div id="SF_INFO_CLOSE" onclick="similarproducts.util.bCloseEvent(this, 2);"></div>',
					'</div>'
				].join('');
			}
			else
			{
				return "";
			}
		},

		updIframeSize: function(itemsNum, tlsNum, su) {},

		bCloseEvent : function( btn, evt )
		{
			var sp = spsupport.p;

			if (btn)
			{
				if (btn.id == "SF_CloseButton")
				{

				}
				else if (btn.id === "infoBtn" || btn.id === 'SF_INFO_CLOSE')
				{
					switch (evt)
					{
						case 1:

							break;

						case 2:

							if(similarproducts.info.isCustomActionEnabled)
							{
								similarproducts.info.ev();
							}
							else
							{
								if(!similarproducts.info.isOpen)
								{
									similarproducts.info.isOpen = true
									this.sendRequest("{\"cmd\": 4, \"show\" : 1 }");

									sp.$('#SF_INFO_TOOLTIP').show();
									sp.$('#SF_INFO_CLOSE').show();

									if( (+btn.getAttribute("sent")) != 1){
										btn.setAttribute("sent", 1);
										setTimeout( function(){
											similarproducts.util.reportInfOpen();
										}, 1000);
									}
								}
								else
								{
									similarproducts.info.isOpen = false;
									this.sendRequest("{\"cmd\": 4, \"show\" : 0 }");

									sp.$('#SF_INFO_TOOLTIP').hide();
									sp.$('#SF_INFO_CLOSE').hide();
								}
							}
							break;

						case 0:
						default:

					}
				}


				var suEv = 0;
				if ( evt == 4 ){
					suEv = 5;
				}
				else if( evt == 5 ){

				}
				if ((evt == 4 || evt == 5) && similarproducts.b.closePSU) {
					var suBtn = document.getElementById("SF_SLIDE_UP_CLOSE");
					if (suBtn) {
						similarproducts.b.closePSU (suBtn, suEv);
					}
				}

				if ( evt == 2 )
				{
					if (btn.id == "SF_CloseButton")
					{
						this.closePopup();
					}
				}
			}
		},

		setPosition: function( pos, su ){
			var vp = this.getViewport(window);
			var slw = spsupport.slideup ? spsupport.slideup.w : 30;
			var pS = this.bubble().style;
			var top = ( su ?  (vp.h - similarproducts.p.height - 20) : pos.y );
			var left = ( su ? vp.w - similarproducts.p.width - slw - 80 : pos.x );
			if (spsupport.p.isIEQ) {
				top = top + vp.t;
				left = left + vp.l;
			}
			pS.top = top  + "px";
			pS.left = left  + "px";
			pS.position = ( su ? ( spsupport.p.isIEQ ? "absolute" : "fixed" ) : "absolute" );
		},

		reportClose: function() {
			return; // canceling report for closing windows.

			var sp = spsupport.p;
			var data = {
				"action" : "close",
				"userid" : sp.userid,
				"sessionid" : similarproducts.util.currentSessionId,
				"before" : ( +sp.before == -1 ? 0 : sp.before ),
				"srtime" : spsupport.api.sTime(2)
			}
                        
            if (similarproducts.utilities.abTestUtil) {
                data = similarproducts.utilities.abTestUtil.addDataToObject(data);
            }
                        
			spsupport.api.jsonpRequest( sp.sfDomain_ + sp.sessRepAct, data);
			if (data.before == 0) {
				similarproducts.publisher.report(100);
			}
		},

		reportInfOpen: function() {
			var sp = spsupport.p;
			var data =             {
				"action" : "info_open",
				"userid" : sp.userid,
				"sessionid" : this.currentSessionId
			};

			if (similarproducts.utilities.abTestUtil) {
				data = similarproducts.utilities.abTestUtil.addDataToObject(data);
			}

			spsupport.api.jsonpRequest( sp.sfDomain_ + sp.sessRepAct, data);
		},

		requestImg: function() {},

		fixDivsPos: function() {
		 spsupport.api.fixDivsPos();
		 },

		jpR: function(url, data) {
			spsupport.api.jsonpRequest(url, data);
		},

		osr: function(ic) {
			spsupport.api.osr(ic, 2);
		},

		sfsrp: function(ic) {
			spsupport.api.sfsrp(ic, 2);
		},

		closePopup: function(){
			if( !similarproducts.util.busy ) {

				clearTimeout(spsupport.p.oopsTm);

				spsupport.p.$('#SF_ScreenLayout').hide();
				spsupport.p.$('#SF_VISUAL_SEARCH').css({left:-2000, top:-2000});
				spsupport.p.$('#SF_INFO_TOOLTIP').hide();

				similarproducts.p.onAir = 0;
				similarproducts.util.reportClose();
				spsupport.p.iiPlOn = 0;

				this.sendRequest("{\"cmd\": 3 }");
			}
		},

		getUniqueId : function(){
			var d = new Date();
			var ID = spsupport.p.userid.substr(0, 5) + d.getDate() + "" +
				( d.getMonth() + 1) + "" +
				d.getFullYear() + "" +
				d.getHours() + "" +
				d.getMinutes() + "" +
				d.getSeconds() + "-" +
				d.getMilliseconds() + "-" +
				Math.floor( Math.random() * 10001 );
			similarproducts.util.currentSessionId = ID;
			return ID;
		},

		getViewport: function()
		{
			var wnd = spsupport.p.$(window);

			return {
				'w': wnd.width(),
				'h': wnd.height(),
				't': wnd.scrollTop(),
				'l': wnd.scrollLeft()
			};
		}
	};


	similarproducts.p.height = 446;
	similarproducts.p.width = 483;
	similarproducts.p.onAir = 0;

	similarproducts.util.initPopup(1);
}
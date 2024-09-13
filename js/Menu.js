MODE_SINGLE = 'single';
MODE_MULTI = 'multi'

class Menu {
    mode = MODE_SINGLE;
    modeIndex = 0;
    modes = [MODE_SINGLE, MODE_MULTI];

    visible = true;

    views = [];

    singleBgFillCommand = null;
    multiBgFillCommand = null;

    nextPressed = false;
    prevPressed = false;

    constructor() {
        gGameEngine.botsCount = 4;
        gGameEngine.playersCount = 0;

        this.showLoader();
    }

    show(text) {
        this.visible = true;

        this.draw(text);
    }

    hide() {
        this.visible = false;

        for (var i = 0; i < this.views.length; i++) {
            gGameEngine.canvas.removeChild(this.views[i]);
        }

        this.views = [];
    }

    update() {
        if (this.visible) {
            for (var i = 0; i < this.views.length; i++) {
                gGameEngine.moveToFront(this.views[i]);
            }

            if (gInputEngine.actions['bomb']) {
                this.setMode(this.mode);
                this.nextPressed = true;
            }
            // Throttling
            if (this.nextPressed) {
                if (!gInputEngine.actions['right']) {
                    // Release the button
                    this.nextPressed = false;
                }
            } else if (gInputEngine.actions['right']) {
                this.nextPressed = true;
                this.nextOption();
            }

            if (this.prevPressed) {
                if (!gInputEngine.actions['left']) {
                    // Release the button
                    this.prevPressed = false;
                }
            } else if (gInputEngine.actions['left']) {
                this.prevPressed = true;
                this.prevOption();
            }
        }
    }

    nextOption() {
        this.modeIndex++;
        this.modeIndex %= this.modes.length;
        this.mode = this.modes[this.modeIndex];
        this.updateModes();
    }

    prevOption() {
        this.modeIndex += this.modes.length + 1;
        this.modeIndex %= this.modes.length;
        this.mode = this.modes[this.modeIndex];
        this.updateModes();
    }

    setHandCursor(btn) {
        btn.addEventListener('mouseover', function() {
            document.body.style.cursor = 'pointer';
        });
        btn.addEventListener('mouseout', function() {
            document.body.style.cursor = 'auto';
        });
    }

    setMode(mode) {
        this.hide();

        if (mode === MODE_SINGLE) {
            gGameEngine.botsCount = 3;
            gGameEngine.playersCount = 1;
        } else {
            gGameEngine.botsCount = 2;
            gGameEngine.playersCount = 2;
        }

        gGameEngine.playing = true;
        gGameEngine.restart();
    }

    draw(text) {
        var that = this;

        // semi-transparent black background
        var bgGraphics = new createjs.Graphics().beginFill("rgba(0, 0, 0, 0.5)").drawRect(0, 0, gGameEngine.size.w, gGameEngine.size.h);
        var bg = new createjs.Shape(bgGraphics);
        gGameEngine.canvas.addChild(bg);
        this.views.push(bg);

        // game title
        text = text || [{text: 'Bomber', color: '#ffffff'}, {text: 'girl', color: '#ff4444'}];

        var title1 = new createjs.Text(text[0].text, "bold 35px Helvetica", text[0].color);
        var title2 = new createjs.Text(text[1].text, "bold 35px Helvetica", text[1].color);

        var titleWidth = title1.getMeasuredWidth() + title2.getMeasuredWidth();

        title1.x = gGameEngine.size.w / 2 - titleWidth / 2;
        title1.y = gGameEngine.size.h / 2 - title1.getMeasuredHeight() / 2 - 80;
        gGameEngine.canvas.addChild(title1);
        this.views.push(title1);

        title2.x = title1.x + title1.getMeasuredWidth();
        title2.y = gGameEngine.size.h / 2 - title1.getMeasuredHeight() / 2 - 80;
        gGameEngine.canvas.addChild(title2);
        this.views.push(title2);

        // modes buttons
        var modeSize = 110;
        var modesDistance = 20;
        var modesY = title1.y + title1.getMeasuredHeight() + 40;

        // singleplayer button
        var singleX = gGameEngine.size.w / 2 - modeSize - modesDistance;
        var singleBgGraphics = new createjs.Graphics();
        this.singleBgFillCommand = singleBgGraphics.beginFill("rgba(0, 0, 0, 0.5)").command;
        singleBgGraphics.drawRect(singleX, modesY, modeSize, modeSize);

        var singleBg = new createjs.Shape(singleBgGraphics);
        gGameEngine.canvas.addChild(singleBg);
        this.views.push(singleBg);
        this.setHandCursor(singleBg);
        singleBg.addEventListener('click', function() {
            that.setMode(MODE_SINGLE);
        });

        var singleTitle1 = new createjs.Text("single", "16px Helvetica", "#ff4444");
        var singleTitle2 = new createjs.Text("player", "16px Helvetica", "#ffffff");
        var singleTitleWidth = singleTitle1.getMeasuredWidth() + singleTitle2.getMeasuredWidth();
        var modeTitlesY = modesY + modeSize - singleTitle1.getMeasuredHeight() - 20;

        singleTitle1.x = singleX + (modeSize - singleTitleWidth) / 2;
        singleTitle1.y = modeTitlesY;
        gGameEngine.canvas.addChild(singleTitle1);
        this.views.push(singleTitle1)

        singleTitle2.x = singleTitle1.x + singleTitle1.getMeasuredWidth();
        singleTitle2.y = modeTitlesY;
        gGameEngine.canvas.addChild(singleTitle2);
        this.views.push(singleTitle2)

        var iconsY = modesY + 13;
        var singleIcon = new createjs.Bitmap("static/img/betty.png");
        singleIcon.sourceRect = new createjs.Rectangle(0, 0, 48, 48);
        singleIcon.x = singleX + (modeSize - 48) / 2;
        singleIcon.y = iconsY;
        gGameEngine.canvas.addChild(singleIcon);
        this.views.push(singleIcon);

        // multiplayer button
        var multiX = gGameEngine.size.w / 2 + modesDistance;
        var multiBgGraphics = new createjs.Graphics();
        this.multiBgFillCommand = multiBgGraphics.beginFill("rgba(0, 0, 0, 0.5)").command;
        multiBgGraphics.drawRect(multiX, modesY, modeSize, modeSize);

        var multiBg = new createjs.Shape(multiBgGraphics);
        gGameEngine.canvas.addChild(multiBg);
        this.views.push(multiBg);
        this.setHandCursor(multiBg);
        multiBg.addEventListener('click', function() {
            that.setMode(MODE_MULTI);
        });

        var multiTitle1 = new createjs.Text("multi", "16px Helvetica", "#99cc00");
        var multiTitle2 = new createjs.Text("player", "16px Helvetica", "#ffffff");
        var multiTitleWidth = multiTitle1.getMeasuredWidth() + multiTitle2.getMeasuredWidth();

        multiTitle1.x = multiX + (modeSize - multiTitleWidth) / 2;
        multiTitle1.y = modeTitlesY;
        gGameEngine.canvas.addChild(multiTitle1);
        this.views.push(multiTitle1)

        multiTitle2.x = multiTitle1.x + multiTitle1.getMeasuredWidth();
        multiTitle2.y = modeTitlesY;
        gGameEngine.canvas.addChild(multiTitle2);
        this.views.push(multiTitle2)

        var multiIconGirl = new createjs.Bitmap("static/img/betty.png");
        multiIconGirl.sourceRect = new createjs.Rectangle(0, 0, 48, 48);
        multiIconGirl.x = multiX + (modeSize - 48) / 2 - 48/2 + 8;
        multiIconGirl.y = iconsY;
        gGameEngine.canvas.addChild(multiIconGirl);
        this.views.push(multiIconGirl);

        var multiIconBoy = new createjs.Bitmap("static/img/betty2.png");
        multiIconBoy.sourceRect = new createjs.Rectangle(0, 0, 48, 48);
        multiIconBoy.x = multiX + (modeSize - 48) / 2 + 48/2 - 8;
        multiIconBoy.y = iconsY;
        gGameEngine.canvas.addChild(multiIconBoy);
        this.views.push(multiIconBoy);

        this.updateModes();
    }

    showLoader() {
        var bgGraphics = new createjs.Graphics().beginFill("#000000").drawRect(0, 0, gGameEngine.size.w, gGameEngine.size.h);
        var bg = new createjs.Shape(bgGraphics);
        gGameEngine.canvas.addChild(bg);

        var loadingText = new createjs.Text("Loading...", "20px Helvetica", "#FFFFFF");
        loadingText.x = gGameEngine.size.w / 2 - loadingText.getMeasuredWidth() / 2;
        loadingText.y = gGameEngine.size.h / 2 - loadingText.getMeasuredHeight() / 2;
        gGameEngine.canvas.addChild(loadingText);
        gGameEngine.canvas.update();
    }

    updateModes() {
        // Change background color
        if (this.mode === MODE_SINGLE) {
            this.singleBgFillCommand.style = "rgba(255, 255, 255, 0.4)";
            this.multiBgFillCommand.style = "rgba(0, 0, 0, 0.5)";
        } else {
            this.singleBgFillCommand.style = "rgba(0, 0, 0, 0.5)";
            this.multiBgFillCommand.style = "rgba(255, 255, 255, 0.4)";
        }
    }
}
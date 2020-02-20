class Carousel2d {
    constructor(id, contentList, property) {
        this.setProperty(property);
        this.colClass = id + 'Col_';
        this.rowClass = id + 'Row_';
        this.viewid = id + 'View';
        this.moveEventid = id + 'Move';
        this.rootid = id;

        let contentNum = this.contentHeightNum * this.contentHeightNum;

        this.positionX = 0;
        this.positionY = 0;

        if (contentNum !== contentList.length) {
            console.warn('Content count and content list count are inconsistent. ' +
                'Make sure that the product of "contentHeightNum" and "contentHeightNum" matches the number of elements in "contentList".');
        }
        let root = document.getElementById(id);
        for (let i = 0; i < this.contentHeightNum; i++) {
            let row = document.createElement('div');
            row.classList.add(this.rowClass, 'carousel2dRow');
            for (let j = 0; j < this.contentWidthNum; j++) {
                let col = document.createElement('div');
                col.classList.add(this.colClass, 'carousel2dCol');
                col.onclick = () => {
                    this.moveAbsolute(j, i)
                };
                col.setAttribute('id', this.rootid + (i * this.contentWidthNum + j).toString() + '_');
                let img = document.createElement('img');
                img.classList.add('carousel2dContent');
                img.setAttribute('src', contentList[i * this.contentWidthNum + j]);
                col.appendChild(img);
                row.appendChild(col);
            }
            root.appendChild(row);
        }
        this.initMove();
        if (this.useView) {
            let target = document.getElementById(this.target2id()).firstElementChild.cloneNode();
            document.getElementById(this.viewid).appendChild(target);
        }
        this.moveEventInit();
        this.dragEventInit();
        if (this.useController) {
            this.addController()
        }

    }

    target2id() {
        return this.rootid + (this.targetY * this.contentWidthNum + this.targetX).toString() + '_'
    }

    setProperty(property) {
        this.contentWidthNum = property.contentWidthNum;
        this.contentHeightNum = property.contentHeightNum;
        this.targetX = property.targetX;
        this.targetY = property.targetY;
        this.useView = property.useView;
        this.useController = property.useController;
    }

    initMove() {
        let root = document.getElementById(this.rootid);
        let col = document.getElementsByClassName(this.colClass);

        //  calculates the initial amount of move
        let mainW = root.clientWidth;
        let mainH = root.clientHeight;
        let contentW = col[0].clientWidth;
        let contentH = col[0].clientHeight;
        let x = ((mainW - contentW) / 2 - contentW * this.targetX) / contentW;
        let y = ((mainH - contentH) / 2 - contentH * this.targetY) / contentH;

        // Move and Transparent element
        for (let i = 0; i < col.length; i++) {
            col[i].style.transform = `translate3d(${this.positionX + x * 100}%, ${this.positionY + y * 100}%, 0)`;
            col[i].style.opacity = '0.3';
        }

        // Init position set
        this.positionX = x * 100;
        this.positionY = y * 100;
        // Target is not transparent
        let a = document.getElementById(this.target2id());
        a.style.opacity = '1';
    }

    moveRelative(x, y) {
        if (this.isOverTargetIndex(x, y)) return;
        let col = document.getElementsByClassName(this.colClass);
        for (let i = 0; i < col.length; i++) {
            col[i].style.transform = `translate3d(${this.positionX + x * 100}%, ${this.positionY + y * 100}%, 0)`;
            col[i].style.opacity = '0.3';
        }
        this.positionX = this.positionX + x * 100;
        this.positionY = this.positionY + y * 100;
        this.targetX = this.targetX - x;
        this.targetY = this.targetY - y;
        document.getElementById(this.rootid).dispatchEvent(this.moveEvent);
    }

    moveAbsolute(x, y) {
        let moveX = this.targetX - x;
        let moveY = this.targetY - y;
        this.moveRelative(moveX, moveY)
    }

    moveLeft() {
        this.moveRelative(1, 0)
    }

    moveRight() {
        this.moveRelative(-1, 0)
    }

    moveUp() {
        this.moveRelative(0, 1)
    }

    moveDown() {
        this.moveRelative(0, -1)
    }

    isOverTargetIndex(x, y) {
        let ntx = this.targetX - x;
        let nty = this.targetY - y;
        return ntx < 0 || ntx > this.contentWidthNum - 1 || nty < 0 || nty > this.contentHeightNum - 1;
    }

    moveEventInit() {
        this.moveEvent = new Event(this.moveEventid);
        document.getElementById(this.rootid).addEventListener(this.moveEventid, () => {
            // Target is not transparent
            let a = document.getElementById(this.target2id());
            a.style.opacity = '1';
            // Change View
            if (this.useView) {
                // Remove existing contentRemove existing content
                let p = document.getElementById(this.viewid);
                // Add targeted content
                p.removeChild(p.firstChild);
                let target = document.getElementById(this.target2id()).firstElementChild.cloneNode();
                p.appendChild(target)

            }
        });
    }

    addController() {
        let root = document.getElementById(this.rootid);
        let left = document.createElement('div');
        left.classList.add('carousel2dController-left', 'carousel2dController');
        left.onclick = () => this.moveLeft();
        let right = document.createElement('div');
        right.classList.add('carousel2dController-right', 'carousel2dController');
        right.onclick = () => this.moveRight();
        let up = document.createElement('div');
        up.classList.add('carousel2dController-up', 'carousel2dController');
        up.onclick = () => this.moveUp();
        let down = document.createElement('div');
        down.classList.add('carousel2dController-down', 'carousel2dController');
        down.onclick = () => this.moveDown();
        root.appendChild(left);
        root.appendChild(right);
        root.appendChild(down);
        root.appendChild(up);
    }

    dragEventInit() {
        let root = document.getElementById(this.rootid);
        root.addEventListener("dragstart", e => {
            this.startX = e.clientX;
            this.startY = e.clientY;
            // Turn off animation
            let col = document.getElementsByClassName(this.colClass);
            for (let i = 0; i < col.length; i++) {
                col[i].style.transition = 'transform 0s, opacity 0s';
            }
        });

        root.addEventListener("drag", e => {
            // Countermeasures that become 0 when the mouse on
            if (e.clientX !== 0) {
                this.diffX = -this.startX + e.clientX;
            }
            if (e.clientY !== 0) {
                this.diffY = -this.startY + e.clientY;
            }
            // Animation
            let col = document.getElementsByClassName(this.colClass);
            for (let i = 0; i < col.length; i++) {
                col[i].style.transform = `translate3d(${this.positionX}%, ${this.positionY}%, 0) translate3d(${this.diffX}px, ${this.diffY}px, 0)`;
            }
        });

        root.addEventListener("dragend", () => {
            let col = document.getElementsByClassName(this.colClass);
            let contentW = col[0].clientWidth;
            let contentH = col[0].clientHeight;
            // Turn on animation
            for (let i = 0; i < col.length; i++) {
                col[i].style.transform = `translate3d(${this.positionX}%, ${this.positionY}%, 0)`;
                col[i].style.transition = '';
            }
            // Calculation of actual move distance
            let moveX = Math.round(this.diffX / contentW);
            if (moveX === 0 && this.diffX > contentW / 10) moveX = 1;
            else if (moveX === 0 && -this.diffX > contentW / 10) moveX = -1;
            let moveY = Math.round(this.diffY / contentH);
            if (moveY === 0 && this.diffY > contentH / 10) moveY = 1;
            else if (moveY === 0 && -this.diffY > contentH / 10) moveY = -1;

            this.moveRelative(moveX, moveY);

        })
    }

}

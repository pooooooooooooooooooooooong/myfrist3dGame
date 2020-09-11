import { _decorator, Component, Node, systemEvent , SystemEventType , math , Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerControl')
export class PlayerControl extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    @property
    speed = 0;

    private _accLeft = false;
    private _accRight = false;
    private _accForward = false;
    private _accBack = false;

    start () {
        systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEventType.KEY_UP, this.onKeyUp, this);
    }

    /**
     * 键盘点击事件的监听
     * @param e 键盘点击事件
     */
    onKeyDown(e) {
        switch (e.keyCode) {
            case cc.macro.KEY.a: this._accLeft = true; break;
            case cc.macro.KEY.s: this._accBack = true; break;
            case cc.macro.KEY.w: this._accForward = true; break;
            case cc.macro.KEY.d: this._accRight = true; break;
            case cc.macro.KEY.space:; break;
        }
        if(e.keyCode != cc.macro.KEY.space){
            this.setPlayerRotation()
        }else{
            this.doShootAction()
        }
    }
    /**
     * 键盘点击释放的监听
     * @param e 键盘点击事件
     */

    onKeyUp(e) {
        switch (e.keyCode) {
            case cc.macro.KEY.a: this._accLeft = false; break;
            case cc.macro.KEY.s: this._accBack = false; break;
            case cc.macro.KEY.w: this._accForward = false; break;
            case cc.macro.KEY.d: this._accRight = false; break;
            case cc.macro.KEY.space:; break;
        }
    }

    setPlayerRotation(){
        let xSpeed = 0;
        let zSpeed = 0;
        if (this._accLeft != this._accRight) {
            xSpeed = this._accLeft ? -1 : 1;
        }
        if (this._accBack != this._accForward) {
            zSpeed = this._accForward ? -1 : 1;
        }
        const PI = 3.1415926535;
        const rotationY = this.node.getRotation();
        //会根据当前角度计算，不适用
        // math.Quat.rotateAround(rotationY, rotationY, this._getDirection(0, -1, 0), 1 / 360.0 * PI);
        let v3_1 = new Vec3(xSpeed,0,zSpeed);
        // console.log(rotationY)
        // v3_1 = this._getDirection(xSpeed, 0,zSpeed)
        // Math.acosh(xSpeed*zSpeed/Math.abs(xSpeed)*Math.abs(zSpeed))
        // console.log(v3_1);
        let angle = 0;
        if(v3_1.x == 0){
            if(v3_1.z == 0){
                angle = 0
            }else{
                if(v3_1.z >0){
                    angle = 180;
                }else{
                    angle = 0;
                }
            }
        }else{
            if(v3_1.z == 0){
                if(v3_1.x>0){
                    angle = -90;
                }else{
                    angle = 90;
                }
            }else{
                if(v3_1.z<0){
                    if(v3_1.x<0){
                        angle = 45;
                    }else{
                        angle = -45;
                    }
                }else{
                    if(v3_1.x<0){
                        angle = 135
                    }else{
                        angle = -135
                    }
                }
            }
        }
        // console.log(angle);
        this.node.setRotationFromEuler(0,angle,0);
    }
    doShootAction(){

    }

    _getDirection(x: number, y: number, z: number) {
        const result = new Vec3(x, y, z);
        math.Vec3.transformQuat(result, result, this.node.getRotation());
        return result;
    }

    update (deltaTime: number) {
        // return;
        let xSpeed = 0;
        let zSpeed = 0;
        if (this._accLeft != this._accRight) {
            xSpeed = this._accLeft ? -1 : 1;
        }
        if (this._accBack != this._accForward) {
            zSpeed = this._accForward ? -1 : 1;
        }
        const position = this.node.getPosition();
        math.Vec3.scaleAndAdd(position, position,new Vec3(-xSpeed, 0,-zSpeed),deltaTime * this.speed);
        this.node.setPosition(position);
    }
}

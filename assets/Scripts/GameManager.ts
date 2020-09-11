import { _decorator, Component, Node, ColliderComponent, ITriggerEvent, isValid } from 'cc';
const { ccclass, property } = _decorator;
enum EGroup{
    G_PLANE = 1 << 0,
    G_ROLE = 1 << 1,
    G_BODY = 1 << 2
}
@ccclass('GameManager')
export class GameManager extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({ type: Node })
    public playerNode: Node = null;

    @property({ type: Node })
    public planeNode: Node = null;


    start () {
        // Your initialization goes here.
           // role setup
           if (this.playerNode) {
            this.playerNode.name = 'Player';
            const collider = this.playerNode.getComponent(ColliderComponent);
            if(collider){
                collider.isTrigger = true;
                collider.setGroup(EGroup.G_ROLE);
                collider.setMask(EGroup.G_BODY);
                collider.on('onTriggerEnter', this._onTriggerEnter0, this);
                collider.on('onTriggerExit', this._onTriggerExit0, this);
            }
        }

        // plane setup
        if (this.planeNode) {
            this.planeNode.name = 'Plane';
            let collider = this.getComponent(ColliderComponent);
            if (collider) {
                collider.setGroup(EGroup.G_PLANE);
                collider.setMask(EGroup.G_BODY);
            }
        }
    }
    private _onTriggerEnter0 (event: ITriggerEvent) {
        if (event.otherCollider.node.name == 'Body') {
            event.otherCollider.setMask(EGroup.G_BODY + EGroup.G_ROLE);
            const that = event.otherCollider.node;
            setTimeout(() => {
                if (isValid(that)) {
                    if (that.active && that.worldPosition.y < 0) {
                        that.active = false;
                    }
                }
            }, 750);
        }
    }

    private _onTriggerExit0 (event: ITriggerEvent) {
        if (event.otherCollider.node.name == 'Body') {
            if (event.otherCollider.node.worldPosition.y >= 0) {
                event.otherCollider.setMask(-1);
            }
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}

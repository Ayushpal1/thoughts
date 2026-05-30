export class Drawable{
    draw(ctx, camera){
        // most probably this will be thrown when this method is not present in the child.
        throw new Error("draw() not implemented.");
    }
}
function Bst(root) {
    this.root = root;

    this.insert = function (node) {
        this.root.addChild(node);
    }
}

function BstNode(value) {
    this.value = value;
    this.left;
    this.right;

    this.addChild = function (node) {
        if (node.value < this.value) {
            if (this.left == undefined) {
                this.left = node;
            } else {
                this.left.addChild(node);
            }
        } else {
            if (this.right == undefined) {
                this.right = node;
            } else {
                this.right.addChild(node);
            }
        }
    }
}

function arrayIntoBstNode(array, start, end) {
    if (start > end)
        return;
    var mid = Math.floor((start + end) / 2);
    var node = new BstNode(array[mid]);
    node.left = arrayIntoBstNode(array, start, mid - 1);
    node.right = arrayIntoBstNode(array, mid + 1, end);
    return node;
}

var arr = [];
for (var i = 0; i < 40; i++) {
    arr.push(i);
}
var bst = new Bst(arrayIntoBstNode(arr, 0, arr.length - 1))
console.log(bst);
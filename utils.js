class Utils {
    isVisible(node) {
        return !node.classList.contains('invisible');
    }

    static toggleVisible(node) {
        Utils.toggleClass(node, 'invisible');
    }

    static toggleClass(node, className) {
        if (node.classList.contains(className)) {
            node.classList.remove(className);
            return false;
        } else {
            node.classList.add(className);

            return true;
        }
    }

    static hide(node) {
        node.classList.add('invisible');
    }
}

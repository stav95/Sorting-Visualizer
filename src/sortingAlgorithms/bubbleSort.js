// array: {index: index in the original array, value: value of the element}
export function bubbleSort(array, animations) {
    let limit = array.length - 1;

    for (let i = 0; i < limit; i++) {
        for (let j = 0; j < limit - i; j++) {
            let move = false;
            let final = -1;

            if (limit - i - 1 === j) {
                if (array[j].value > array[j + 1].value)
                    final = array[j].index;
                else
                    final = array[j + 1].index;
            }

            if (array[j].value > array[j + 1].value) {

                move = true;

                let tmp = array[j + 1];
                array[j + 1] = array[j];
                array[j] = tmp;
            }

            animations.push({
                id1: array[j].index,
                id2: array[j + 1].index,
                index1: j,
                index2: j + 1,
                move: move,
                final: final
            });
        }
    }

    return array;
}
// array: {index: index in the original array, value: value of the element}
export function selectionSort(array, animations) {
    let max = -1;

    for (let i = 0; i < array.length; i++)
        if (array[i].value > max)
            max = array[i].value + 1;

    for (let i = 0; i < array.length; i++) {
        let minIndex = 0;
        let min = max;
        for (let j = i; j < array.length; j++) {
            if (i !== j) {
                animations.push({
                    id1: array[i].index,
                    id2: array[j].index,
                    index1: i,
                    index2: j,
                    minIndex: array[minIndex].index,
                    move: false
                });
            }

            if (min > array[j].value) {
                min = array[j].value;
                minIndex = j;
            }
        }

        animations.push({
            id1: array[i].index,
            id2: array[minIndex].index,
            index1: minIndex,
            index2: i,
            minIndex: array[minIndex].index,
            move: true,
            final: true
        });

        let tmp = array[i];
        array[i] = array[minIndex];
        array[minIndex] = tmp;
    }
}
//obj: {array - array of elements, startIndex: start index of the array according to the original array}
// array: {index: index in the original array, value: value of the element}
export function mergeSort(obj, animations) {
    let array = obj.array;
    if (array.length <= 1) return obj;

    let mid = Math.floor(array.length / 2)

    let arrayLeft = { array: array.slice(0, mid), startIndex: obj.startIndex };
    let arrayRight = { array: array.slice(mid, array.length), startIndex: obj.startIndex + mid };

    return merge(
        mergeSort(arrayLeft, animations),
        mergeSort(arrayRight, animations),
        animations);
}

function merge(objLeft, objRight, animations) {
    let arrayLeft = objLeft.array;
    let arrayRight = objRight.array;
    let startIndex = objLeft.startIndex;
    let resultArray = [], leftIndex = 0, rightIndex = 0;

    let group = [];

    arrayLeft.forEach(ele => {
        group.push(ele.index);
    });

    arrayRight.forEach(ele => {
        group.push(ele.index);
    });

    let order = [];
    while (leftIndex < arrayLeft.length && rightIndex < arrayRight.length) {
        if (arrayLeft[leftIndex].value < arrayRight[rightIndex].value) {
            order.push({
                id: arrayLeft[leftIndex].index,
                index: startIndex + order.length
            });
            resultArray.push(arrayLeft[leftIndex]);
            leftIndex++;
        } else {
            order.push({
                id: arrayRight[rightIndex].index,
                index: startIndex + order.length
            });
            resultArray.push(arrayRight[rightIndex]);
            rightIndex++;
        }
    }

    while (leftIndex < arrayLeft.length) {
        order.push({
            id: arrayLeft[leftIndex].index,
            index: startIndex + order.length
        });
        resultArray.push(arrayLeft[leftIndex]);
        leftIndex++;
    }

    while (rightIndex < arrayRight.length) {
        order.push({
            id: arrayRight[rightIndex].index,
            index: startIndex + order.length
        });
        resultArray.push(arrayRight[rightIndex]);
        rightIndex++;
    }

    animations.push({
        group: group,
        order: order
    });

    return { array: resultArray, startIndex: startIndex };
}
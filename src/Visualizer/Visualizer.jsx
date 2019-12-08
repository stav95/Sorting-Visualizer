import { mergeSort } from '../sortingAlgorithms/mergeSort.js';
import { bubbleSort } from '../sortingAlgorithms/bubbleSort.js';
import { selectionSort } from '../sortingAlgorithms/selectionSort.js';

import React from 'react';
import './Visualizer.css';

import '../../node_modules/react-input-range/lib/css/index.css';
import InputRange from 'react-input-range';


let NUMBERS_OF_BARS = 10;
const BAR_WIDTH = 45;
const MIN = 20;
const MAX = 400;

const MAIN_COLOR = 'turquoise';
const LAST_PLACE_COLOR = 'purple';
const CHECKING_COLOR = 'yellow';
const SELECTED_ALGO_COLOR = 'khaki';
let ANIMATION_SPEED = 500;
let LOCK_CONTROLS = false;

export default class Visualizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            arraySizeMin: 1,
            arraySizeMax: 100,
            arraySizeValue: NUMBERS_OF_BARS,
            animationSpeedMin: 10,
            animationSpeedMax: 5000,
            animationSpeedValue: ANIMATION_SPEED
        };
    }

    componentDidMount() {
        this.createNewArray();
    }

    createNewArray() {
        if (LOCK_CONTROLS)
            return;

        let array = [];

        for (let index = 0; index < NUMBERS_OF_BARS; index++) {
            array.push({
                index: index,
                value: this.getRandomInteger(MIN, MAX)
            });
        }

        let elements = document.getElementsByClassName('array-bar');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = MAIN_COLOR;
            elements[i].style.transform = '';
        }

        this.setState({ array });
    }

    changeArraySize(value) {
        if (LOCK_CONTROLS)
            return;

        this.setState({ arraySizeValue: value })
        NUMBERS_OF_BARS = value;
        this.createNewArray();
    }

    changeAnimationSpeed(value) {
        if (LOCK_CONTROLS)
            return;

        this.setState({ animationSpeedValue: value })
        ANIMATION_SPEED = value;
    }
    getRandomInteger(min, max) {
        // include min, max
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    lock_controls(lock, id) {
        LOCK_CONTROLS = lock;

        if (id != null && id.length > 0)
            document.getElementById(id).style.color = lock ? SELECTED_ALGO_COLOR : "";
    }

    reset_bars() {
        let bars = document.getElementsByClassName('array-bar');

        for (let i = 0; i < bars.length; i++) {
            bars[i].style.transform = '';
            bars[i].style.backgroundColor = MAIN_COLOR;
        }
    }

    render() {
        let array = this.state.array;
        let leftValue = ((window.innerWidth - (NUMBERS_OF_BARS * BAR_WIDTH)) / 2);
        return (
            <div>
                <div id="top-menu" >
                    <div id="createNewArray" className="element-top-menu" onClick={() => this.createNewArray()}>Create New Array</div>
                    <div className="separator"></div>
                    <div className="element-top-menu normal-cursor">Change Array Size</div>
                    <div className="range">
                        <InputRange
                            minValue={this.state.arraySizeMin}
                            maxValue={this.state.arraySizeMax}
                            value={this.state.arraySizeValue}
                            onChange={value => this.changeArraySize(value)} />
                    </div>
                    <div className="separator"></div>
                    <div className="element-top-menu normal-cursor">Change Sorting Speed</div>
                    <div className="range">
                        <InputRange
                            minValue={this.state.animationSpeedMin}
                            maxValue={this.state.animationSpeedMax}
                            value={this.state.animationSpeedValue}
                            onChange={value => this.changeAnimationSpeed(value)} />
                    </div>
                    <div className="separator"></div>
                    <div className="separator"></div>
                    <div className="separator"></div>
                    <div id="algoMergeSort" className="element-top-menu algo" onClick={() => this.performMergeSort()}>Merge Sort</div>
                    <div className="separator"></div>
                    <div id="algoBubbleSort" className="element-top-menu algo" onClick={() => this.performBubbleSort()}>Bubble Sort</div>
                    <div className="separator"></div>
                    <div id="algoSelectionSort" className="element-top-menu algo" onClick={() => this.performSelectionSort()}>Selection Sort</div>
                </div>
                {
                    array.map((value, idx) => (
                        <div
                            id={idx}
                            className="array-bar"
                            key={idx}
                            style={{
                                backgroundColor: MAIN_COLOR,
                                height: `${value.value}px`,
                                width: BAR_WIDTH - 4,
                                left: leftValue + (BAR_WIDTH * idx),
                                top: '120px'
                            }}>
                                {value.value}
                            </div>
                    ))
                }
            </div>
        );
    }

    performMergeSort() {
        if (LOCK_CONTROLS)
            return;

        this.lock_controls(true, 'algoMergeSort');
        this.reset_bars();

        const array = [...this.state.array];
        let animations = [];

        mergeSort({ array: array, startIndex: 0 }, animations);

        let countTimes = [0];
        for (let i = 0; i < animations.length - 1; i++) {
            countTimes.push(
                animations[i].group.length * ANIMATION_SPEED
                + ANIMATION_SPEED
                + countTimes[countTimes.length - 1]);
        }

        for (let i = 0; i < animations.length; i++) {
            setTimeout(() => {
                const anim = animations[i];
                let group = anim.group;
                let order = anim.order;

                for (let j = 0; j < group.length; j++) {
                    let ele = document.getElementById(group[j]);

                    let transformX = ele.style.transform.replace('translateX(', '').replace(')', '');
                    if (transformX.length === 0)
                        transformX = '0px';

                    ele.style.transitionDuration = `${ANIMATION_SPEED / 1000}s`;
                    ele.style.transform = `translate(${transformX},${MAX + 10}px)`;
                }

                for (let j = 0; j < order.length; j++) {
                    setTimeout(() => {
                        let ele = document.getElementById(order[j].id);
                        let transformX = (order[j].index - order[j].id) * BAR_WIDTH;

                        ele.style.transitionDuration = `${ANIMATION_SPEED / 1000}s`;
                        ele.style.transform = `translateX(${transformX}px)`;

                        if (i === animations.length - 1) {
                            ele.style.backgroundColor = LAST_PLACE_COLOR;
                        }

                        if (i === animations.length - 1 && j === order.length - 1) {
                            this.lock_controls(false, 'algoMergeSort');
                        }
                    }, ANIMATION_SPEED * (j + 1));
                }
            }, countTimes[i]);
        }
    }

    performBubbleSort() {
        if (LOCK_CONTROLS)
            return;

        this.lock_controls(true, 'algoBubbleSort');
        this.reset_bars();

        const array = [...this.state.array];
        let animations = [];

        bubbleSort(array, animations);

        let countTime = 0;
        for (let i = 0; i < animations.length; i++) {
            const anim = animations[i];

            let ele1 = document.getElementById(anim.id1);
            let ele2 = document.getElementById(anim.id2);

            ele1.style.transitionDuration = `${ANIMATION_SPEED / 1000}s`;
            ele2.style.transitionDuration = `${ANIMATION_SPEED / 1000}s`;

            setTimeout(() => {
                ele1.style.backgroundColor = CHECKING_COLOR;
                ele2.style.backgroundColor = CHECKING_COLOR;
            }, countTime);

            if (anim.move) {
                let transformX1 = (anim.index1 - anim.id1) * BAR_WIDTH;
                let transformX2 = (anim.index2 - anim.id2) * BAR_WIDTH;

                countTime += ANIMATION_SPEED;
                setTimeout(() => {
                    ele1.style.transform = `translateX(${transformX1}px)`;
                    ele2.style.transform = `translateX(${transformX2}px)`;

                    ele1.style.backgroundColor = MAIN_COLOR;
                    ele2.style.backgroundColor = MAIN_COLOR;

                    if (anim.final > -1) {
                        if (i === animations.length - 1) {
                            ele1.style.backgroundColor = LAST_PLACE_COLOR;
                            ele2.style.backgroundColor = LAST_PLACE_COLOR;
                        }
                        else {
                            if (ele1.id === anim.final)
                                ele1.style.backgroundColor = LAST_PLACE_COLOR;
                            else
                                ele2.style.backgroundColor = LAST_PLACE_COLOR;
                        }
                    }

                }, countTime);

                countTime += ANIMATION_SPEED;
            }
            else {
                countTime += ANIMATION_SPEED;
                setTimeout(() => {
                    ele1.style.backgroundColor = MAIN_COLOR;
                    ele2.style.backgroundColor = MAIN_COLOR;

                    if (anim.final > -1) {
                        if (i === animations.length - 1) {
                            ele1.style.backgroundColor = LAST_PLACE_COLOR;
                            ele2.style.backgroundColor = LAST_PLACE_COLOR;
                        }
                        else {
                            if (ele1.id === anim.final)
                                ele1.style.backgroundColor = LAST_PLACE_COLOR;
                            else
                                ele2.style.backgroundColor = LAST_PLACE_COLOR;
                        }
                    }

                }, countTime);

                countTime += ANIMATION_SPEED;
            }

            if (i === animations.length - 1) {
                setTimeout(() => {
                    this.lock_controls(false, 'algoBubbleSort');
                }, countTime);
            }
        }
    }

    performSelectionSort() {
        if (LOCK_CONTROLS)
            return;

        this.lock_controls(true, 'algoSelectionSort');
        this.reset_bars();

        const array = [...this.state.array];
        let animations = [];

        selectionSort(array, animations);

        const bars = document.getElementsByClassName('array-bar');

        const MOVE_Y_UP = -10;
        let countTime = 0;
        for (let i = 0; i < animations.length; i++) {
            const anim = animations[i];

            let ele1 = document.getElementById(anim.id1);
            let ele2 = document.getElementById(anim.id2);

            ele1.style.transitionDuration = `${ANIMATION_SPEED / 1000}s`;
            ele2.style.transitionDuration = `${ANIMATION_SPEED / 1000}s`;

            setTimeout(() => {
                ele1.style.backgroundColor = CHECKING_COLOR;
                ele2.style.backgroundColor = CHECKING_COLOR;

                for (let j = 0; j < bars.length; j++) {
                    let posX = this.get_x_pos_transform(j);
                    let ele = document.getElementById(j);

                    if (j !== anim.minIndex)
                        ele.style.transform = `translate(${posX}px,0px)`;
                    else
                        ele.style.transform = `translate(${posX}px,${MOVE_Y_UP}px)`;
                }
            }, countTime);

            if (anim.move) {
                let transformX1 = (anim.index1 - anim.id1) * BAR_WIDTH;
                let transformX2 = (anim.index2 - anim.id2) * BAR_WIDTH;

                countTime += ANIMATION_SPEED;
                setTimeout(() => {
                    ele1.style.transform = `translate(${transformX1}px,0px)`;
                    ele2.style.transform = `translate(${transformX2}px,0px)`;

                    ele1.style.backgroundColor = MAIN_COLOR;
                    ele2.style.backgroundColor = MAIN_COLOR;

                    if (anim.final > -1) {
                        if (i === animations.length - 1) {
                            ele1.style.backgroundColor = LAST_PLACE_COLOR;
                            ele2.style.backgroundColor = LAST_PLACE_COLOR;
                        }
                        else {
                            if (ele1.id === anim.final)
                                ele1.style.backgroundColor = LAST_PLACE_COLOR;
                            else
                                ele2.style.backgroundColor = LAST_PLACE_COLOR;
                        }
                    }

                }, countTime);

                countTime += ANIMATION_SPEED;
            }
            else {
                ele1.style.transform = `translate(${this.get_x_pos_transform(anim.id1)}px,${(anim.id1 === anim.minIndex ? MOVE_Y_UP : 0)}px)`;
                ele2.style.transform = `translate(${this.get_x_pos_transform(anim.id2)},${(anim.id2 === anim.minIndex ? MOVE_Y_UP : 0)}px)`;

                countTime += ANIMATION_SPEED;
                setTimeout(() => {
                    ele1.style.backgroundColor = MAIN_COLOR;
                    ele2.style.backgroundColor = MAIN_COLOR;
                }, countTime);

                countTime += ANIMATION_SPEED;
            }

            if (i === animations.length - 1) {
                setTimeout(() => {
                    this.lock_controls(false, 'algoSelectionSort');
                }, countTime);
            }
        }
    }

    get_x_pos_transform(id) {
        let posX = document.getElementById(id).style.transform.replace('translate(', '');
        posX = posX.slice(0, posX.indexOf('px'));

        return posX.length > 0 ? posX : 0;
    }
}

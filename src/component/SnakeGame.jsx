import { useEffect, useState } from 'react';
import { IoFlowerOutline } from 'react-icons/io5';

import LinkedList from '../lib/LinkedList';

const SIZE = 15;
const SNAKE_SPEED = 100;

const getRandomPosition = () => ({
    x: Number((Math.random() * (SIZE - 1)).toFixed()),
    y: Number((Math.random() * (SIZE - 1)).toFixed())
})

const checkForDirectionSafety = (snakeBody, nextDirection, previousDirection) => {

    let directionExists = false;
    ['Up', 'Down', 'Right', 'Left'].forEach(direction => direction === nextDirection ? directionExists = true : null);
    if ( !directionExists )
        return false;

    if ( snakeBody.size === 1 || !previousDirection )
        return true;

    if ( previousDirection === 'Up' && nextDirection === 'Down' )
        return false;
    if ( previousDirection === 'Down' && nextDirection === 'Up' )
        return false;
    if ( previousDirection === 'Left' && nextDirection === 'Right' )
        return false;
    if ( previousDirection === 'Right' && nextDirection === 'Left' )
        return false;

    return true;
}

const snakeHeadHitsBody = (snakeHead, snakeBody) => {
    let collide = false;
    snakeBody.toArray().slice(1).forEach(cell => snakeHead.x === cell.x && snakeHead.y === cell.y ? collide = true : null);
    return collide;
}

const checkForCollision = (snakeBody, direction, setSnakeFailed) => {

    let head = snakeBody.firstItem();
    const snakeHitItsBody = snakeHeadHitsBody(head, snakeBody, direction, setSnakeFailed);
    if ( snakeHitItsBody ) {
        setSnakeFailed(true);
        return true;
    }

    switch ( direction ) {
        case 'Up':
            if ( head.y === 0 ) {
                setSnakeFailed(true);
                return true;
            }
        break;

        case 'Down':
            if ( head.y === SIZE - 1 ) {
                setSnakeFailed(true);
                return true;
            }
        break;

        case 'Left':
            if ( head.x === 0 ) {
                setSnakeFailed(true);
                return true;
            }
        break;
        
        case 'Right':
            if ( head.x === SIZE - 1 ) {
                setSnakeFailed(true);
                return true;
            }
        break;
        
        default:
            return false;
        break;
    }
}

const createFood = (snakeBody) => {
    let x = null;
    let y = null;
    let collision = false;
    const snakeToArray = snakeBody.toArray();

    do {
        x = Number((Math.random() * (SIZE - 1)).toFixed());
        y = Number((Math.random() * (SIZE - 1)).toFixed());

        collision = snakeToArray.some(coordinates => coordinates.x === x && coordinates.y === y);
    } while ( collision );

    return { x, y };
}

const createSnake = () => {
    const list = new LinkedList();
    list.add(getRandomPosition())
    return list;
}

const Board = () => {
    let array = new Array();
    for ( let i = 0; i < SIZE; i++ ) {
        let innerArray = [];
        for ( let l = 0; l < SIZE; l++ ) {
            innerArray.push(0);
        }
        array.push(innerArray);
    }

    return array;
}

const cellStyle = (cellProp) => {
    if ( cellProp === 2 ) {
        return 'snake'
    }
}

const addMovementListener = (snakeBody, snakeDirection, setSnakeDirection, movementLocked, setMovementLocked) => {
    window.onkeydown = ({ key }) => {
        if ( movementLocked )
            return;

        const safeDirection = checkForDirectionSafety(snakeBody, key.slice(5), snakeDirection);
        if ( !safeDirection )
            return;

        setSnakeDirection(key.slice(5));
        setMovementLocked(true);
        setTimeout(() => setMovementLocked(false), SNAKE_SPEED);
    }
}

const getNewSnakePosition = (snake, direction, snakeScores) => {

    let newSnake = Object.assign({}, snake);
    newSnake.__proto__ = snake.__proto__;

    let head = snake.firstItem();
    let tail = null;

    switch ( direction ) {
        case 'Up':
            head = { x: head.x, y: head.y - 1 };
            newSnake.insertMiddle(head);
            
            if ( !snakeScores )
                tail = newSnake.removeLast();
            return { newSnake, head, tail: tail || null };
            break;

        case 'Down':
            head = { x: head.x, y: head.y + 1 };
            newSnake.insertMiddle(head);

            if ( !snakeScores )
                tail = newSnake.removeLast();
            return { newSnake, head, tail: tail || null };
            break;
        
        case 'Left':
            head = { x: head.x - 1, y: head.y };
            newSnake.insertMiddle(head);

            if ( !snakeScores )
                tail = newSnake.removeLast();
            return { newSnake, head, tail: tail || null };
            break;

        case 'Right':
            head = { x: head.x + 1, y: head.y };
            newSnake.insertMiddle(head);

            if ( !snakeScores )
                tail = newSnake.removeLast();
            return { newSnake, head, tail: tail || null };
            break;

        default:
        break;
    }
}

const snakeScored = (snakeBody, food) => {
    const head = snakeBody.firstItem();

    if ( head.x === food.x && head.y === food.y )
        return true;

    return false;
}

const moveSnake = (snakeBody, setSnakeBody, snakeDirection, setSnakeFailed, food, setFood, score, setScore) => {

    let collision, snakeScores = false;

    switch ( snakeDirection ) {
        case 'Up':
            collision = checkForCollision(snakeBody, snakeDirection, setSnakeFailed);
            if ( collision )
                return { collision, head: null, tail: null };
            
            snakeScores = snakeScored(snakeBody, food, snakeDirection);  
            var { newSnake, head, tail } = getNewSnakePosition(snakeBody, snakeDirection, snakeScores);
            setSnakeBody(newSnake);
            
            if ( snakeScores ) {
                setScore(score + 1);
                setFood(createFood(newSnake));
            }
            return { head, tail };
            break;

        case 'Down':
            collision = checkForCollision(snakeBody, snakeDirection, setSnakeFailed);
            if ( collision )
                return { collision, head: null, tail: null };

            snakeScores = snakeScored(snakeBody, food, snakeDirection);
            var { newSnake, head, tail } = getNewSnakePosition(snakeBody, snakeDirection, snakeScores);
            setSnakeBody(newSnake);
            
            if ( snakeScores ) {
                setScore(score + 1);
                setFood(createFood(newSnake));
            }
            return { head, tail };
            break;

        case 'Left':
            collision = checkForCollision(snakeBody, snakeDirection, setSnakeFailed);
            if ( collision )
                return { collision, head: null, tail: null };

            snakeScores = snakeScored(snakeBody, food, snakeDirection);
            var { newSnake, head, tail } = getNewSnakePosition(snakeBody, snakeDirection, snakeScores);
            setSnakeBody(newSnake);
            
            if ( snakeScores ) {
                setScore(score + 1);
                setFood(createFood(newSnake));
            }
            return { head, tail };
            break;

        case 'Right':
            collision = checkForCollision(snakeBody, snakeDirection, setSnakeFailed);
            if ( collision )
                return { collision, head: null, tail: null };            

            snakeScores = snakeScored(snakeBody, food, snakeDirection);
            var { newSnake, head, tail } = getNewSnakePosition(snakeBody, snakeDirection, snakeScores);
            setSnakeBody(newSnake);
            
            if ( snakeScores ) {
                setScore(score + 1);
                setFood(createFood(newSnake));
            }
            return { head, tail };
            break;

        default:
        break;

    }
}

const renderGame = (board, setBoard, head, tail, snakeBody, food) => {
    const temporaryBoard = board;

    if ( food )
        temporaryBoard[food.y][food.x] = 1;

    if ( !head && !tail ) {
        const snakeHead = snakeBody.firstItem();
        temporaryBoard[snakeHead.y][snakeHead.x] = 2;
    } else if ( head && !tail ) {
        temporaryBoard[head.y][head.x] = 2;
    } else {
        temporaryBoard[head.y][head.x] = 2;
        temporaryBoard[tail.y][tail.x] = 0;    
    }

    setBoard([...temporaryBoard]);
}

const foodChecker = (box) => box === 1 ? <div className={'foodScaler'}><IoFlowerOutline className={'food'} /></div> : <></>

const resetGame = (setSnakeDirection, setSnakeBody, setSnakeFailed, setMovementLocked, setFood, setBoard, setScore) => {
    setSnakeDirection(null);
    let snakeBody = createSnake();
    setSnakeBody(snakeBody);
    setSnakeFailed(false);
    setMovementLocked(false);
    setFood(createFood(snakeBody));
    setBoard(Board());
    setScore(0);
}

const SnakeGame = () => {

    const [snakeDirection, setSnakeDirection] = useState(null);
    const [snakeBody, setSnakeBody] = useState(createSnake());
    const [snakeFailed, setSnakeFailed] = useState(false);
    const [movementLocked, setMovementLocked] = useState(false);
    const [food, setFood] = useState();
    const [board, setBoard] = useState(Board());
    const [score, setScore] = useState(0);

    useEffect(() => setFood(createFood(snakeBody)), [])

    useEffect(() => {
        renderGame(board, setBoard, null, null, snakeBody, food);
        addMovementListener(snakeBody, snakeDirection, setSnakeDirection, movementLocked, setMovementLocked)
    }, [movementLocked, food, snakeFailed])

    useEffect(() => {
        let id = null;
        if ( snakeDirection ) {
            id = setInterval(() => {
                const { collision, head, tail } = moveSnake(snakeBody, setSnakeBody, snakeDirection, setSnakeFailed, food, setFood, score, setScore);
                if ( !collision )
                    renderGame(board, setBoard, head, tail);
            }, SNAKE_SPEED);
        }

        return () => clearInterval(id);
    }, [snakeDirection, snakeBody, food]);

    useEffect(() => {
        if ( snakeFailed ) {
            setSnakeDirection(null);
            window.onkeydown = null;
        }
    }, [snakeFailed]);

    return (
        <main>
            {
                snakeFailed
                ? (
                    <div className={'gameplayControl fail'}>
                        <p>You Lost! Your Point Was {score}</p>
                        <button onClick={() => {
                            resetGame(
                            setSnakeDirection, 
                            setSnakeBody,
                            setSnakeFailed, 
                            setMovementLocked, 
                            setFood, 
                            setBoard, 
                            setScore
                        );
                        }}>Play Again</button>
                    </div>
                )
                : <div className={'gameplayControl'}>Your Score Is {score}</div>
            }
            <table>
            {
                board.map((row) => (
                    <tr>
                    {
                        row.map((box) => <td className={cellStyle(box)}>{foodChecker(box)}</td>)
                    }
                    </tr>
                ))
            }
            </table>
        </main>
    )
}

export default SnakeGame;
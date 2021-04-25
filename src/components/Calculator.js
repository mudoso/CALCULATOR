import React, { useEffect, useState } from 'react'

const Calculator = () => {
    const [formula, setFormula] = useState([])
    const [result, setResult] = useState('0')
    const [isFinalResult, setIsFinalResult] = useState(false)

    useEffect(() => {
        const isParsable = result.length > 1

        if (!isParsable) { return }
        if (isFinalResult) {
            return setFormula([...formula, '='])
        }
        setFormula(curr => curr.map((item, index) => {
            const [operation, startNum, ...rest] = item.split('')
            const startsWithDot = startNum === '.' && item.length <= 2
            switch (true) {
                case item > 0:
                    return '+' + parseFloat(item)
                case startsWithDot:
                    return operation + '0.0'
                default:
                    return operation + parseFloat(item.slice(1))
            }
        }))
    }, [result])

    const handleClear = () => {
        setFormula([])
        setResult('0')
    }

    const handleValues = (e) => {
        const value = e.target.value
        const isValueDot = value === '.'
        const [...rest] = result.split('')

        if ((rest.includes('.')) && isValueDot) { return }

        // @ts-ignore
        if (isNaN(result) && isNaN(value) && !isValueDot) {
            setFormula(currList => [...currList.slice(0, -1), value])
            setResult(value)
            return
        }

        setFormula(currList => [...currList.slice(0, -1), result + value])

        if (isFinalResult) {
            setFormula([value])
            setResult('')
            setIsFinalResult(false)
        }

        result === '0'
            ? setResult(value)
            : setResult(currValue => currValue + value)
    }

    const handleOperations = e => {
        const value = e.target.value
        // @ts-ignore
        const operator = result[0]
        const number = result[1]
        // @ts-ignore
        const isValidOperation = isNaN(operator) && !isNaN(number)
        // @ts-ignore
        const isNumber = !isNaN(result)

        if (isFinalResult) {
            setFormula([result])
            setIsFinalResult(false)
        }
        // @ts-ignore
        if (isValidOperation || isNumber) {
            setFormula(currList => [...currList, value])
        }
        setResult(value)
    }

    const handleEquals = () => {
        if (result === 'ERROR') { return }

        const lastIndex = formula.join('').length - 1
        const lastStrItem = formula.join('')[lastIndex]
        const decimalRound = 100000000
        // @ts-ignore
        const finalStr = isNaN(lastStrItem)
            ? formula.slice(0, -1).join('')
            : formula.join('')

        const finalEval =
            Math.round(decimalRound * eval(finalStr)) / decimalRound

        const mappedFinalEval =
            (finalEval + '')
                .split('')
                .filter((_, index) => index < 10).join('')

        setIsFinalResult(true)
        // @ts-ignore
        setResult(mappedFinalEval !== 'NaN' ? mappedFinalEval : "ERROR")
    }


    return (
        <div id='calculator'>
            <div id='display'>
                <div className='formula'>{formula}</div>
                <div className='result'>{result}</div>
            </div>

            <button id='clear'
                value='AC'
                className='btn-secondary'
                onClick={handleClear}
            >AC</button>
            <button id='add'
                value='+'
                className='btn-fourth'
                onClick={handleOperations}
            >+</button>
            <button id='subtract'
                value='-'
                className='btn-fourth'
                onClick={handleOperations}
            >-</button>
            <button id='multiply'
                value='*'
                className='btn-fourth'
                onClick={handleOperations}
            >x</button>
            <button id='divide'
                value='/'
                className='btn-fourth'
                onClick={handleOperations}
            >/</button>

            <button id='one' value={1} onClick={handleValues}>1</button>
            <button id='two' value={2} onClick={handleValues}>2</button>
            <button id='three' value={3} onClick={handleValues}>3</button>
            <button id='four' value={4} onClick={handleValues}>4</button>
            <button id='five' value={5} onClick={handleValues}>5</button>
            <button id='six' value={6} onClick={handleValues}>6</button>
            <button id='seven' value={7} onClick={handleValues}>7</button>
            <button id='eight' value={8} onClick={handleValues}>8</button>
            <button id='nine' value={9} onClick={handleValues}>9</button>
            <button id='zero' value={0} onClick={handleValues}>0</button>
            <button id='decimal' value='.' onClick={handleValues}>.</button>

            <button id='equals'
                value='='
                className='btn-tertiary'
                onClick={handleEquals}
            >=</button>
        </div>
    )
}

export default Calculator

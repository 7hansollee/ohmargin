'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Calculator() {
  const [display, setDisplay] = useState<string>('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFocused) return;
      
      // 숫자 키 (0-9)
      if (/^[0-9]$/.test(event.key)) {
        inputDigit(event.key);
      }
      // 연산자 키
      else if (['+', '-', '*', '/'].includes(event.key)) {
        performOperation(event.key);
      }
      // Enter 키 (계산 실행)
      else if (event.key === 'Enter' || event.key === '=') {
        handleEqual();
      }
      // Escape 키 (초기화)
      else if (event.key === 'Escape') {
        clearDisplay();
      }
      // Backspace 키 (마지막 숫자 삭제)
      else if (event.key === 'Backspace') {
        setDisplay(prev => {
          if (prev.length === 1) return '0';
          return prev.slice(0, -1);
        });
      }
      // 소수점
      else if (event.key === '.') {
        inputDecimal();
      }
      // 퍼센트
      else if (event.key === '%') {
        setDisplay(String(parseFloat(display) / 100));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, firstOperand, operator, waitingForSecondOperand, isFocused]);

  const inputDigit = (digit: string) => {
    setIsFocused(true);
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    setIsFocused(true);
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setIsFocused(true);
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    setIsFocused(true);
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand: number, secondOperand: number, operator: string): number => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleEqual = () => {
    setIsFocused(true);
    if (!operator || firstOperand === null) return;

    const inputValue = parseFloat(display);
    const result = calculate(firstOperand, inputValue, operator);
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(true);
  };

  return (
    <Card className="w-[400px] mt-4">
      <CardHeader>
        <CardTitle>계산기</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className={`bg-gray-100 p-4 rounded-lg text-right text-2xl font-bold min-h-[3rem] relative flex items-center justify-end cursor-pointer transition-all duration-200 focus:outline-none ${
              isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}
            onClick={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            tabIndex={0}
          >
            <span>{display}</span>
            {isFocused && (
              <motion.div
                className="w-[2px] h-8 bg-gray-500 ml-1"
                animate={{
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" onClick={clearDisplay}>C</Button>
            <Button variant="outline" onClick={() => setDisplay(String(parseFloat(display) * -1))}>+/-</Button>
            <Button variant="outline" onClick={() => setDisplay(String(parseFloat(display) / 100))}>%</Button>
            <Button variant="outline" onClick={() => performOperation('/')}>÷</Button>

            <Button variant="outline" onClick={() => inputDigit('7')}>7</Button>
            <Button variant="outline" onClick={() => inputDigit('8')}>8</Button>
            <Button variant="outline" onClick={() => inputDigit('9')}>9</Button>
            <Button variant="outline" onClick={() => performOperation('*')}>×</Button>

            <Button variant="outline" onClick={() => inputDigit('4')}>4</Button>
            <Button variant="outline" onClick={() => inputDigit('5')}>5</Button>
            <Button variant="outline" onClick={() => inputDigit('6')}>6</Button>
            <Button variant="outline" onClick={() => performOperation('-')}>-</Button>

            <Button variant="outline" onClick={() => inputDigit('1')}>1</Button>
            <Button variant="outline" onClick={() => inputDigit('2')}>2</Button>
            <Button variant="outline" onClick={() => inputDigit('3')}>3</Button>
            <Button variant="outline" onClick={() => performOperation('+')}>+</Button>

            <Button variant="outline" className="col-span-2" onClick={() => inputDigit('0')}>0</Button>
            <Button variant="outline" onClick={inputDecimal}>.</Button>
            <Button variant="outline" onClick={handleEqual}>=</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
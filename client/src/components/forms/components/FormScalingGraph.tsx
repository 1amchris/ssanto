import { uniqueId } from 'lodash';
import { parse } from 'path';
import React, { useEffect } from 'react';
import { useRef, createRef, ReactElement, RefObject, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Control } from '.';
import FormComponent from './FormComponent';

type Coordinates = {
  x: number;
  y: number;
};

//Ceci doit être fait dans le serveur en fait
function parseFunction(stringFunction: string) {
  const parsedFunction = (x: number) => -x + 150;
  return parsedFunction;
}

function FormScalingGraph(props: any) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(
    null
  );
  const value_scaling_function = parseFunction(props.value_scaling_function);

  const width = 150;
  const height = 150;

  React.useEffect(() => {
    let mouseDown: boolean = false;
    let start: Coordinates = { x: 0, y: 0 };
    let end: Coordinates = { x: 0, y: 0 };
    let canvasOffsetLeft: number = 0;
    let canvasOffsetTop: number = 0;

    function handleMouseDown(evt: MouseEvent) {
      mouseDown = true;

      start = {
        x: evt.clientX - canvasOffsetLeft,
        y: evt.clientY - canvasOffsetTop,
      };
    }

    function handleMouseUp(evt: MouseEvent) {
      if (mouseDown && context) {
        context.beginPath();
        context.arc(start.x, start.y, 5, 0, Math.PI * 2, true);
        context.fill();
        context.fillStyle = '#000';
        context.closePath();
      }
      mouseDown = false;
    }

    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext('2d');

      if (renderCtx) {
        canvasRef.current.addEventListener('mousedown', handleMouseDown);
        canvasRef.current.addEventListener('mouseup', handleMouseUp);

        canvasOffsetLeft = canvasRef.current.offsetLeft;
        canvasOffsetTop = canvasRef.current.offsetTop;

        setContext(renderCtx);
      }
    }

    // Draw a rectangle
    if (context) {
      context.beginPath();
      context.moveTo(0, value_scaling_function(0));
      for (let x = 0; x < width; x++) {
        let y = value_scaling_function(x);
        context.lineTo(x, y);
      }
      context.stroke();
    }

    return function cleanup() {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', handleMouseDown);
        canvasRef.current.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [context]);

  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      <canvas
        id="canvas"
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          marginTop: 10,
          backgroundColor: '#FFFFFF',
          borderRadius: '15px',
        }}
      ></canvas>
    </div>
  );
}

export default FormScalingGraph;

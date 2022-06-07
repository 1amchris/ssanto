import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OutputType } from 'enums/OutputType';
import { RootState } from 'store/store';
import ICreateOutput from 'models/ICreateOutput';
import IOutput from 'models/IOutput';

export const outputSlice = createSlice({
  name: 'output',
  initialState: {
    outputs: [
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Formatting completed in 0.021ms.`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Formatting file:///Users/christophebeaulieu/Developer/ssanto/src/components/core/PanelBar.tsx`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Using config file at '/Users/christophebeaulieu/Developer/ssanto/.prettierrc.json'`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Using ignore file (if present) at /Users/christophebeaulieu/Developer/ssanto/.prettierignore`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `File Info: {
            "ignored": false,
            "inferredParser": "typescript"
          }`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Detected local configuration (i.e. .prettierrc or .editorconfig), VS Code configuration will not be used`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Prettier Options: {
            "filepath": "/Users/christophebeaulieu/Developer/ssanto/src/components/core/PanelBar.tsx",
            "parser": "typescript",
            "arrowParens": "avoid",
            "endOfLine": "lf",
            "printWidth": 80,
            "singleQuote": true,
            "useTabs": false
          }`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Formatting completed in 0.034ms.`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Formatting completed in 0.021ms.`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Formatting file:///Users/christophebeaulieu/Developer/ssanto/src/components/core/PanelBar.tsx`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Using config file at '/Users/christophebeaulieu/Developer/ssanto/.prettierrc.json'`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Using ignore file (if present) at /Users/christophebeaulieu/Developer/ssanto/.prettierignore`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `File Info: {
            "ignored": false,
            "inferredParser": "typescript"
          }`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Detected local configuration (i.e. .prettierrc or .editorconfig), VS Code configuration will not be used`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Prettier Options: {
            "filepath": "/Users/christophebeaulieu/Developer/ssanto/src/components/core/PanelBar.tsx",
            "parser": "typescript",
            "arrowParens": "avoid",
            "endOfLine": "lf",
            "printWidth": 80,
            "singleQuote": true,
            "useTabs": false
          }`,
      },
      {
        time: Date.now(),
        type: OutputType.Info,
        message: `Formatting completed in 0.034ms.`,
      },
    ] as IOutput[],
  },
  reducers: {
    addOutput: (
      state,
      { payload: { message, type } }: PayloadAction<ICreateOutput>
    ) => {
      state.outputs.push({
        message,
        type,
        time: Date.now(),
      });
    },
  },
});

export const { addOutput } = outputSlice.actions;

export const selectOutput = (state: RootState) => state.output;

export default outputSlice.reducer;

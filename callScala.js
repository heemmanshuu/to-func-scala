const vscode = require('vscode')
const fs = require('fs'); // to read and write to files

var text = "this is my code";

//import * as vscode from 'vscode'
const callbackForCommand = () => {

  console.log("entered callback function");
  const textEditor = vscode.window.activeTextEditor; // This is good, a global var to access the vscode process
  //const documentText = editor.getText(); // This should give you the text in the open file

  var firstLine = textEditor.document.lineAt(0);
  var lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
  var textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);

  //console.log(textRange);

  var oritext = textEditor.document.getText(textRange);

  // Call Scala program, give documentText as input, throw the output into a file for now

  fs.writeFile("C:/Users/gnana/Desktop/IDEtool/namrata/src/main/scala/temp_code.scala", oritext, (err) => {
    if (err) throw err;
    console.log('oritext has been saved into file');
  });


  const exec = require('child_process').exec;
  exec(`cd C:/Users/gnana/Desktop/IDEtool/namrata && sbt "run src/main/scala/temp_code.scala" > answers.txt && type answers.txt`,
   (err, stdout, stderr) => {
    console.log('stdout: ' + stdout);
    text = stdout;
    console.log('stderr: ' + stderr);
    if (err) {
        console.log('error: ' + err);
    }
  });

  console.log("completed cp.exec");

  
  const workspaceEdit = new vscode.WorkspaceEdit(); // Can use this class to perform edits, I believe that you 
 // need the range that needs to be updated (good idea to console.log and see what these objects look like, 
 //   I suspect, (line, startCol, len)

  // Make the updates
  workspaceEdit.replace(textEditor.document.uri, textRange, text);


  vscode.workspace.applyEdit(workspaceEdit).then(() => {
    vscode.window.showInformationMessage(
          'refactoring done!'
        );
    textEditor.document.save();
  });
  
  
};

module.exports = callbackForCommand;

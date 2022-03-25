// Highlight on select
function selectText(id) { 
  var sel, range;
  var el = document.getElementById(id); //get element id
  if (window.getSelection && document.createRange) { //Browser compatibility
    sel = window.getSelection();
    if (sel.toString() == '') { //no text selection
      window.setTimeout(function () {
        range = document.createRange(); //range object
        range.selectNodeContents(el); //sets Range
        sel.removeAllRanges(); //remove all ranges from selection
        sel.addRange(range);//add Range to a Selection.
      }, 1);
    }
  } else if (document.selection) { //older ie
    sel = document.selection.createRange();
    if (sel.text == '') { //no text selection
      range = document.body.createTextRange();//Creates TextRange object
      range.moveToElementText(el);//sets Range
      range.select(); //make selection.
    }
  }
}


// Dragging
function triggerMove(title) {
  dragElement(document.getElementById(title));
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "TitleBox")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "TitleBox").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// App Creation
// Create App
function applet(title, content, draggable, width, height, posx, posy) {
  if (document.getElementById(title) == null) { // check if the app is already open
  if (draggable == "terminal") { // make it so when you click on it, it checks for enter so you can submit
    document.body.innerHTML += "<div class='popup' id='" + title + "' onclick='fullfocusapplet(" + '"' + title + '"' + ");terminalSubmit();' onmouseover='triggerMove(" + '"' + title + '"' + ") ' onmouseup='dragElement(document.getElementById(" + '"' + "blank" + '"' + "));'>" + content + "</div>";
  } else if (draggable == "true") { // if you want to make it draggable
    document.body.innerHTML += "<div class='popup' id='" + title + "' onclick='fullfocusapplet(" + '"' + title + '"' + ")' onmouseover='triggerMove(" + '"' + title + '"' + ") ' onmouseup='dragElement(document.getElementById(" + '"' + "blank" + '"' + "));'>" + content + "</div>";
  } else if (draggable == "false") { // if you dont want to make it draggable
    document.body.innerHTML += "<div class='popup' id='" + title + "' onclick='fullfocusapplet(" + '"' + title + '"' + ")' onmouseup='dragElement(document.getElementById(" + '"' + "blank" + '"' + "));'>" + content + "</div>";
  }
  document.getElementById(title).style.width = width; // set width of popup
  document.getElementById(title).style.height = height; // set height of popup
  document.getElementById(title).style.left = posx; // set x position of popup
  document.getElementById(title).style.top = posy; // set y position of popup
  fullfocusapplet(title); // focus on the applet, makes it draggable
  }
}
// Close App
function close(title) {
  document.getElementById(title).remove(); // deletes the popup from the HTML file
}
// Focus the App 
var openApp = null; // sets the currently open popup to nothing. 
function fullfocusapplet(title) {
  document.getElementById("openApp").innerHTML = title; // sets the title at the top to be what popup you last mouseuped on.
  openApp = title; // sets the variable to be the app you opened.
}

// Built in apps
// Manager
var managerOpen = "0"; // if the manager is currently opened. set to closed by default.
var managerList = ""; // the list of apps inside of the manager.
function manager() {
  if (managerOpen === "0") { // if the manager is not opened.
    applet('Manager', "<highlight>Installed Apps:</highlight><br><ul style='margin: 0px;padding:0px;'>" + managerList + "</ul>", 'false', '150px', '200px'); // creates the mangaer popup.
    managerOpen = "1"; // sets the manager to open
  } else if (managerOpen === "1") { // if the manager is open
    close("Manager"); // closes the manager
    managerOpen = "0"; // sets the manager to closed
  }
}
// Establish App
function addToManager(name, open) {
  managerList += "<li style='list-style-type: none;' onclick='" + open + "'>" + name + "</li>"; // adds the app to the list.
  if (managerOpen === "1") { // if the manager is open
    close("Manager"); // close the manager so it can be updated.
    applet('Manager', "<highlight>Installed Apps:</highlight><br><ul style='margin: 0px;padding:0px;'>" + managerList + "</ul>", 'false', '150px', '200px'); // recreates the manager
  }
  if (managerOpen === "0") { // if the manager is closed (ngl i think this is not needed but i dont want to break anything so im going to keep it.)
    applet('Manager', "<highlight>Installed Apps:</highlight><br><ul style='margin: 0px;padding:0px;'>" + managerList + "</ul>", 'false', '150px', '200px') // update the manager
    close("Manager"); // close it.
  }
}
// Closing windows
document.addEventListener("keyup", function (event) {
  if (event.keyCode === 27) { // if the escape key pressed
    if (openApp == "Manager" || openApp == "Clock") { // if the clock app of the manager app is selected
      // dont let it close out the manager and clock.
    } else { // if any other app is selected.
      close(openApp); // close the app
    }
  }
});
// Clock
// Get time function
function currentTime() {
  var today = new Date();
  var datetd = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  let date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

  if (hh === 0) {
    hh = 12;
  }
  if (hh > 12) {
    hh = hh - 12;
    session = "PM";
  }

  mm = (mm < 10) ? "0" + mm : mm;
  ss = (ss < 10) ? "0" + ss : ss;

  let time = hh + ":" + mm + " " + session;

  document.getElementById("datetime").innerHTML = datetd + ' ' + time;
  let t = setTimeout(function () { currentTime() }, 1000);
}
currentTime();
// Clock GUI
var clockOpen = "0"; // sets the clock to closed
function clock() {
  if (clockOpen === "0") { // if the clock is closed
    applet('Clock', "The clock has no editable settings currently.", 'false', 'auto', 'auto', "", ""); // creates the clock app
    document.getElementById('Clock').style.right = "0px" // makes the clock goto the right
    clockOpen = "1"; // sets the clock as open
  } else if (clockOpen === "1") { // if the clock is open
    close("Clock") // closes the clock
    clockOpen = "0"; // marks the clock as closed.
  }
}
// Notifications!
function closenotify() { 
  document.getElementById("raa").style.display = "none"; // sets the notification popup as closed
}
function notify(title,body) {
  document.getElementById("raa").style.display = "block"; // shows the notification bar.
  document.getElementById("raatitle").innerHTML = title; // sets the title to the specified title
  document.getElementById("raabody").innerHTML = body; // sets the body to the specified body
}
// Terminal
// Enter Key Press Listener
function terminalSubmit() { // terminal command subbmitted
  document.getElementById('terminalinput').addEventListener('keydown', (evt) => { // starts a listener
    if (evt.keyCode === 13) { // if enter key pressed
      evt.preventDefault();
      runterminal(); // runs the runterminal function and checks if the command matches other stuff.
    }
  });
}
// creates the terminal
function terminal() {
  if (locked == "false") {  // checks if the computer is logged in
    // creates the window:
    applet('Terminal', '<div id="inputmode"><span id="inlineoutput"></span><terminalin>$ </terminalin><span contenteditable="true" id="terminalinput" onclick="selectText(this.id)">_</span></div><div id="outputmode"><span id="terminaloutput"></span></div>', 'terminal', '600px', '350px', '28px', '55px');
    document.getElementById('inputmode').style.display = "block"; // makes the input div shown. 
    document.getElementById('outputmode').style.display = "none"; // makes the fullscreen output hidden.
    document.getElementById('Terminal').style.margin = "auto"; // makes the margin: auto
    document.getElementById('Terminal').style.backgroundColor = "#151d2e"; // sets the background color. i dont think this is needed anymore but imma leave it here lol.
    document.getElementById('Terminal').style.opacity = "90%"; // sets the opacity. again, i dont think this is needed anymore.
    terminalSubmit() // starts the function with the key listener.
    // Auto scroll terminal
    window.setInterval(function () {
      var elem = document.getElementById('inputmode');
      elem.scrollTop = elem.scrollHeight;
    }, 5000);
  }
}
// Add to Manager
addToManager('Terminal', 'terminal()'); // Adds the Terminal to the Manager for quick access.
// Output text to fullscreen
function outputfullscreen(text) { // output that fills up the entire screen
  document.getElementById('inputmode').style.display = "none"; // hides the input mode div
  document.getElementById('terminaloutput').innerHTML = text; // sets the text to be what was specified
  document.getElementById('outputmode').style.display = "block"; // shows the output div
  document.getElementById('terminalinput').innerHTML = "_"; // resets the terminalinput
}
// Output text inline
function output(text) { // output that only takes up one line and is easy.
  document.getElementById("inlineoutput").innerHTML += "<aqua>$ </aqua>" + document.getElementById("terminalinput").textContent + "<br>"; // adds the command that was entered.
  document.getElementById("inlineoutput").innerHTML += text + "<br>"; // adds the text you made. 
  document.getElementById('terminalinput').innerHTML = "_"; // resets the terminalinput
  selectText("terminalinput"); // auto-selects the terminalinput
}
// Return to input mode if you were in fullscreen output
function inputmode() {
  document.getElementById('inputmode').style.display = "block"; // shows input div
  document.getElementById('outputmode').style.display = "none"; // hides output div
}
// Terminal Commands
var packagemanager = "pm-not-set"; // sets the default package manager
function runterminal() { // run terminal function; this has all of the commands in it.
  switch (document.getElementById("terminalinput").textContent) { // this switchcase is for single-string commands
    case "clear": // clear the console
      document.getElementById("inlineoutput").innerHTML = ""; // sets the output to blank
      document.getElementById('terminalinput').innerHTML = "_"; // sets the input to blank
      selectText("terminalinput"); // selects the terminalinput
      break; // end
    case "defaultpm": // reset the packagemanager
      packagemanager = "https://brodyking.github.io/KimmuPackageManager/"; // sets it to KPM
      output("Reset PM to " + packagemanager); // outputs it is completed
      selectText("terminalinput"); // select the input
      break; // end
    case "help": // shows a breif fullscreen output of all commands
      output("Help menu opened"); // tells you the output menu is opened
      // makes the fullscreen output:
      outputfullscreen("<purple>Kimmu Help Menu</purple><br><br><highlight>echo</highlight> print text to console<br><highlight>clear</highlight> clears the console.<br><highlight>install</highlight> lets you install packages from the KimmuPackageManager<br><highlight>changepm</highlight> lets you change the package manager for install<br><highlight>defaultpm</highlight> lets you reset the package manager to the deafult one<br><highlight>close</highlight> closes a program specified after command (case sensitive)<br><highlight>kget</highlight> is a web browser <br><highlight>changebg</highlight> lets you change your wallpaper<br><highlight>changefont</highlight> lets you change the font<br><highlight>changepswd</highlight> lets you create/change your password<br><highlight>config</highlight> lets you basic settings<br><highlight>reset</highlight> lets you reset all files<br><highlight>restart</highlight> lets you restart the system<br><highlight>cf</highlight> lets you create a file<br><highlight>rf</highlight> lets you delete a file<br><highlight>kedit</highlight> lets you edit a file<br><br><red>NOTE: For a more in-depth help menu, open the Docs applet!</red><br><br>Press q to reset...");
      document.addEventListener("keyup", function(event) { // check if q is pressed (lets the user leave)
          if (event.keyCode === 81) { // q key pressed
            inputmode(); // return to input mode
           }
      });
      break; // end
    case "config": // opens the config GUI
      startupinit() // start config function
      break; // end
    case "reset": // lets the user clear all local storage
      localStorage.clear(); // clears the localStorage
      output('All system settings,files,etc have been <red>deleted</red>.<br>Reboot your system to see the changes.'); // tells the user whats happened
      break; // end
  }
  // Echo
  if (document.getElementById("terminalinput").textContent.slice(0, 4) === "echo") { // if the first 4 letters are echo
    output(document.getElementById("terminalinput").textContent.slice(4, Infinity)); // repeats back everything from letter 4 to Infinity
  } // end
  // Install Applets
  if (document.getElementById("terminalinput").textContent.slice(0, 7) === "install") { // if the first 7 letters equal install
    var script = document.createElement('script'); // starts a script tag in head in html
    script.src = packagemanager + document.getElementById("terminalinput").textContent.slice(8, Infinity) + ".js"; // sets the SRC
    document.head.appendChild(script); // creates the script
    var packagename = document.getElementById("terminalinput").textContent.slice(8, Infinity); // sets the package name
    output("<red>The Offical Kimmu Package Repository is no longer operational. Please remember to use external pm's only.</red><br><br>Installed <aqua>" + document.getElementById("terminalinput").textContent.slice(8, Infinity) + "</aqua> from <a href='" + packagemanager + "'><aqua>" + packagemanager + "</aqua></a>."); // tells you its installed
  } // end
  if (document.getElementById("terminalinput").textContent.slice(0, 8) === "changepm") { // if the first 8 letters are changepm
    packagemanager = document.getElementById("terminalinput").textContent.slice(9, Infinity); // set the packagemanager to letters 9 to infinity
    output("Changed package manager to " + packagemanager); // tell the user
  } // end
  if (document.getElementById("terminalinput").textContent.slice(0, 5) === "close") {
    close(document.getElementById("terminalinput").textContent.slice(6, Infinity));
    if (document.getElementById("terminalinput").textContent.slice(6, Infinity) == "Terminal") {
      // Do nothing... 
    } else {
      output("<aqua>" + document.getElementById("terminalinput").textContent.slice(6, Infinity) + "</aqua> was closed.");
    }
  }
  // KGet
  if (document.getElementById("terminalinput").textContent.slice(0, 4) === "kget") {
    var kgeturl = document.getElementById("terminalinput").textContent.slice(5, Infinity);
    if (kgeturl == "-gb") {
      kgeturl = "https://www.gigablast.com/";
    }
    applet(kgeturl,"<iframe src='" + kgeturl + "' style='width: 100%;height:95%;position:absolute;'></iframe><div style='background-color:black;color: white;position:absolute;bottom:0px;width:100%;'>" + kgeturl + "</div>","true","800px","550px");
    document.getElementById(kgeturl).style.opacity = "100%";
    document.getElementById(kgeturl).style.backgroundColor = "white";
    output("Downloaded and opened <aqua>" + kgeturl + "</aqua>.");

  }
  // Custom Background Changer
  if (document.getElementById("terminalinput").textContent.slice(0, 8) === "changebg") {
    var changebgurl = document.getElementById("terminalinput").textContent.slice(9, Infinity);
    document.body.style.backgroundImage = "url('" + changebgurl + "')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    localStorage.setItem("Wallpaper",changebgurl)
    output("Background changed to <aqua>" + changebgurl + "</aqua>.");
  }
  // Custom Font Changer
  if (document.getElementById("terminalinput").textContent.slice(0, 10) === "changefont") {
    var changefontname = document.getElementById("terminalinput").textContent.slice(11, Infinity);
    document.body.style.fontFamily = changefontname;
    localStorage.setItem("Font",changefontname);
    output("Font changed to <aqua>" + changefontname + "</aqua>.");
  }
  // cf create file
  if (document.getElementById("terminalinput").textContent.slice(0, 2) === "cf") {
    localStorage.setItem(document.getElementById("terminalinput").textContent.slice(3, Infinity),'This document will soon be full of ideas ;)');
    output("<highlight>" + document.getElementById("terminalinput").textContent.slice(3, Infinity) + '</highlight> was created');
  }
  // rf delete file
  if (document.getElementById("terminalinput").textContent.slice(0, 2) === "rf") {
    localStorage.removeItem(document.getElementById("terminalinput").textContent.slice(3, Infinity));
    output("<highlight>" + document.getElementById("terminalinput").textContent.slice(3, Infinity) + '</highlight> was deleted.');
  }
  // kedit edit
  if (document.getElementById("terminalinput").textContent.slice(0, 5) === "kedit") {
    applet(document.getElementById("terminalinput").textContent.slice(6, Infinity),"<span style='display:none;' id='openfile'>" + document.getElementById("terminalinput").textContent.slice(6, Infinity) + "</span>" + '<span contenteditable="true" id="keditinput" onclick="selectText(' + "'keditinput'" +')">' +  localStorage.getItem(document.getElementById("terminalinput").textContent.slice(6, Infinity)) + '</span>' + "<div style='background-color:black;color: white;position:absolute;bottom:0px;width:100%;'><a href='#' onclick='keditsave()'>Save File</a></div>","true","600px","350px");
    output("<highlight>" + document.getElementById("openfile").textContent + "</highlight> was opened in kedit.")
  }
  // system password
  if (document.getElementById("terminalinput").textContent.slice(0, 10) === "changepswd") {
    localStorage.setItem("Password",document.getElementById("terminalinput").textContent.slice(11, Infinity));
    output("Password set to <highlight>" + document.getElementById("terminalinput").textContent.slice(11, Infinity) + "</highlight>.");
  }
}
// Terminal Keybind
document.addEventListener("keyup", function(event) {
    if (event.keyCode === 18) {
        terminal();
    }
});

 
function docs() {
  var docsbody = "<h1 style='font-family: Garamond, serif;margin:0px;'><purple>Help Docs</purple></h1>Welcome to the help docs! This applet will teach you how to use the operating system to its full potential.<br><br><h2 style='font-family: Garamond, serif;margin:0px;'><highlight>Navigation</highlight></h2>Opening a app is as simple as clicking the manager button at the top and selecting a program. The currently selected window will show up at the top middle. To close a window, click ESC or use the terminal command.<br><br><h2 style='font-family: Garamond, serif;margin:0px;'><highlight>The Terminal</highlight></h2>The terminal is a easy way to work the system without a GUI. It is very efficent and gives the user lots of control over their system. What follows will be a guide to how to use each command.<br><br><highlight>echo</highlight> lets you repeat any text you want. (example: echo hello world)<br><br><highlight>clear</highlight> lets you clear the terminal off all previous outputs and commands.<br><br><highlight>install</highlight> lets you install packages from the <a href='https://github.com/brodyking/KimmuPackageManager' style='color: white;'>Kimmu Package Manager</a>. (example: install test)<br><br><highlight>changepm</highlight> lets you change the package manager fromt the deafault one. (example: changepm https://github.com/exampleuser/examplerepository)<br><br><highlight>defaultpm</highlight> lets you reset the package manager to the default one.<br><br><highlight>close</highlight> lets you close any window specified, note it is case sensitive! (example: close Terminal)<br><br><highlight>kget</highlight> lets you open any webside link/url and view it without installing any external applets. (example: kget https://www.google.com) you can also type -gb to open the serach engine quickly<br><br><highlight>changebg</highlight> lets you change your background to any image. (example: changebg wallpapers/default.jpg)<br><br><highlight>changefont</highlight> lets you change the system font. (example: changefont Arial)<br><br><highlight>changepswd</highlight> lets you change the system password. (example: changepswd example)<br><br><highlight>config</highlight> lets you change customization options with a GUI interface. (example: config)<br><br><highlight>reset</highlight> lets you reset all files stored in your browser. (example: reset)<br><br><highlight>restart</highlight> lets you restart the system. (example: restart)<br><br><highlight>cf</highlight> lets you create a file on your local storage.(example: cf test)<br><br><highlight>rf</highlight> lets you delete/remove a file on your local storage.(example: rm test)<br><br><highlight>kedit</highlight> lets you edit a file on your local storage. (example: kedit test)<br><br>";
  applet("Help Docs",docsbody,"true","500px","500px");
}
addToManager("Docs","docs()");

function installApp(text) {
  terminal();
  document.getElementById('terminalinput').innerHTML = "defaultpm";
  runterminal();
  document.getElementById('terminalinput').innerHTML = "install " + text;
  runterminal();
  close('Terminal');
}

function packagemanagergui() {
  applet("Kimmu Software Manager","<div id='pmgui'><center style='color: #ae0000;'>Kimmu Software Manager</center><ul style='margin: 0px;padding:10px;list-style-type: none;' class='config'><li onclick='installApp(" + '"' + 'muBrowser' + '"' + ")'>> muBrowser</li></ul></div><grey style='position: absolute; bottom: 0px; left: 0px;font-size: 16px;'>This list shows all of the packages on the Kimmu Software Manager</grey>","true","600px","350px");
  document.getElementById('Kimmu Software Manager').style.opacity = "100%";
  document.getElementById("Kimmu Software Manager").style.backgroundColor = "#0000b1"
  document.getElementById("pmgui").style.backgroundColor = "#aaaaaa";
  document.getElementById("pmgui").style.border = "4px double black";
  document.getElementById("pmgui").style.margin = "10px";
  document.getElementById("pmgui").style.height = "90%";
  document.getElementById("pmgui").style.color = "black";
}

addToManager("Package Manager","packagemanagergui()");

function changebackground() {
  outputfullscreen('<highlight>Background Image URL: </highlight><span contenteditable="true" id="backgroundchangerinput" onclick="selectText(this.id)">_</span>');
  document.getElementById('backgroundchangerinput').addEventListener('keydown', (evt) => {
    if (evt.keyCode === 13) {
      evt.preventDefault();
      terminal();
      document.getElementById('terminalinput').innerHTML = "changebg " + document.getElementById('backgroundchangerinput').textContent;
      runterminal();
      startupinit();
    }
  });
}

function changefont() {
  outputfullscreen('<highlight>Font Name: </highlight><span contenteditable="true" id="fontchangerinput" onclick="selectText(this.id)">_</span><br><br>Options are: "Arial", "Pixel", "Segoe UI", or any other web safe font.');
  document.getElementById('fontchangerinput').addEventListener('keydown', (evt) => {
    if (evt.keyCode === 13) {
      evt.preventDefault();
      terminal();
      document.getElementById('terminalinput').innerHTML = "changefont " + document.getElementById('fontchangerinput').textContent;
      runterminal();
      startupinit();
    }
  });
}

function changepswd() {
  outputfullscreen('<highlight>Password: </highlight><span contenteditable="true" id="passwordchangeinput" onclick="selectText(this.id)">_</span>');
  document.getElementById('passwordchangeinput').addEventListener('keydown', (evt) => {
    if (evt.keyCode === 13) {
      evt.preventDefault();
      terminal();
      document.getElementById('terminalinput').innerHTML = "changepswd " + document.getElementById('passwordchangeinput').textContent;
      runterminal();
      startupinit();
    }
  });
}

function reset() {
  terminal();
  document.getElementById('terminalinput').innerHTML = "reset";
  runterminal();
  location.reload();
}

function startupinit() {
  output("Config menu opened")
  outputfullscreen('<table>  <tr style="border: 1px solid white;">    <td onclick="changebackground()"><a>Change Background</a></td>    <td>--></td>    <td>Change the background of your enviorment</td>  </tr>  <tr style="border: 1px solid white;">    <td onclick="changefont()"><a>Change Font</a></td>    <td>--></td>    <td>Change the default font of the enviorment.</td>  </tr>  <tr style="border: 1px solid white;">    <td onclick="changepswd()"><a>Set Password</a></td>    <td>--></td>    <td>Create a login password.</td>  </tr>  <tr style="border: 1px solid white;">    <td onclick="reset()"><a>Reset System</a></td>    <td>--></td>    <td>Reset all system files and settings.</td>  </tr>  <tr>    <td onclick="inputmode()"><a>Return to terminal</a></td>  </tr></table>');
}

// Startup Shit
  // On startup change to last used wallpaper
  var changebgurl = localStorage.getItem("Wallpaper")
  document.body.style.backgroundImage = "url('" + changebgurl + "')";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
  // On startup change to the last used font
  var changefontname = localStorage.getItem("Font")
  document.body.style.fontFamily = changefontname;

function keditsave() {
  localStorage.setItem(document.getElementById('openfile').textContent,document.getElementById('keditinput').textContent);
}

var locked = "true";

// Submit Login
function loginSubmit() {
  if (document.getElementById("passwordinput").textContent == localStorage.Password) {
    document.getElementById("taskbar").style.display = "block";
    close("login");
    closenotify();
    locked = "false";
    manager();
    manager();
  } else {
    close('login');
    loginStart();
    notify('Login Error','The password you entered was incorrect!');
  }
}

function resetlocalstorage() {
  localStorage.clear();
  notify("System Reset!","All system files have been deleted. Restart to see changes.");
}

function loginStart() {
  // Password Protection on startup
  if (localStorage.Password == null) {
    // Do nothing, because there is no password!
    locked = "false";
  } else {
    locked = "true";
    document.getElementById("taskbar").style.display = "none";
    applet("login",'<highlight>Password:</highlight> <span contenteditable="true" id="passwordinput" onclick="selectText(this.id)">_</span><br><br>If you forgot your password, you can <a href="#" onclick="resetlocalstorage()">Reset your OS</a>.',"true","300px","100px","60px","60px");
    document.getElementById('passwordinput').addEventListener('keydown', (evt) => {
      if (evt.keyCode === 13) {
        loginSubmit()
      }
    });
  }
}

loginStart();
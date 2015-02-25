/*  This file is part of ToDo List.

    ToDo List is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ToDo List is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with ToDo List. If not, see <http://www.gnu.org/licenses/>.
 */

$.afui.autoLaunch = false; //By default, it is set to true and you're app will run right away.  We set it to false to show a splashscreen
$.afui.useOSThemes = false;
    /* This function runs when the content is loaded.*/
     $(document).ready(function(){
        setTimeout(function(){
            $.afui.launch();
        },1500);
    });

/* window.addEventListener('load', function() {
    new FastClick(document.body);
}, false); */

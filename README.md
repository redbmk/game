# License
    Copyright © 2013  Braden Michael Kelley

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

# Contact
Braden: redbmk@gmail.com

# Notes
* This game currently has no name.
* It's a game about time travel.
* The version of crafty.js included was compiled from the
  [develop branch](https://github.com/craftyjs/Crafty/tree/develop)
  and includes the [Shape plugin](https://github.com/luizbills/CraftyShape).

# Controls
* Movement
    * **w**: up
    * **s**: down
    * **a**: left
    * **d**: right
* Time Manipulation
    * _**left arrow** (while time is frozen)_: Move time backward. Stops when you get to the starting point
    * _**right arrow** (while time is frozen)_: Move time forward. Stops when you get to the present time
    * _**left arrow** (while time is **not** frozen)_: Slow down time. It's possible for time to be in reverse
    * _**right arrow** (while time is **not** frozen)_: Speed up time.
* Other
    * **g**: spawn a ghost that repeats your comands from the start
    * **_spacebar_**: Freeze time
    * **_escape_**: End game (The screen remains the same but everything is disabled. Refresh to start over)

# Known Issues
* The two clocks are not in sync. When time is moving at normal speed, the internal clock should match the external clock
* Some weird stuff happens with the history (for ghosts and/or replays) when you play around with time.

# Changelog
#### v0.0.4
* You can now manipulate time while moving around
* Added two time references
    * The clock gives you a basic reference as to how fast (and what direction) time is moving around you
    * The numbers are actual seconds in real time. This is meant to be your internal clock
* Fixed a bug that was making the game break in Firefox

#### v0.0.3
* Added ability to replay past with left and right arrow keys while time is paused
* Refactored time a bit so that it's now relative to the player

#### v0.0.2
* Added ability to freeze time using spacebar.
* Freezing time creates a trail of where you've just been.

#### v0.0.1
* Just getting started.
* You can move a dot around.
* You can spawn as many "ghosts" as you want.

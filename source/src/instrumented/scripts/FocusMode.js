function cov_26ckrmpig() {
  var path = "/Users/efeichen/Documents/Academics/CSE 110/cse110-w21-group13/source/src/scripts/FocusMode.js";
  var hash = "f30eb07d67bd6adc22c62d45721ceeafcd65b8c6";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/efeichen/Documents/Academics/CSE 110/cse110-w21-group13/source/src/scripts/FocusMode.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 24
        },
        end: {
          line: 8,
          column: 60
        }
      },
      "1": {
        start: {
          line: 9,
          column: 20
        },
        end: {
          line: 9,
          column: 61
        }
      },
      "2": {
        start: {
          line: 10,
          column: 22
        },
        end: {
          line: 10,
          column: 59
        }
      },
      "3": {
        start: {
          line: 12,
          column: 4
        },
        end: {
          line: 12,
          column: 42
        }
      },
      "4": {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 13,
          column: 38
        }
      },
      "5": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 14,
          column: 40
        }
      },
      "6": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 23,
          column: 5
        }
      },
      "7": {
        start: {
          line: 16,
          column: 8
        },
        end: {
          line: 16,
          column: 47
        }
      },
      "8": {
        start: {
          line: 18,
          column: 8
        },
        end: {
          line: 18,
          column: 49
        }
      },
      "9": {
        start: {
          line: 19,
          column: 22
        },
        end: {
          line: 19,
          column: 61
        }
      },
      "10": {
        start: {
          line: 20,
          column: 8
        },
        end: {
          line: 22,
          column: 9
        }
      },
      "11": {
        start: {
          line: 21,
          column: 12
        },
        end: {
          line: 21,
          column: 33
        }
      },
      "12": {
        start: {
          line: 26,
          column: 17
        },
        end: {
          line: 26,
          column: 56
        }
      },
      "13": {
        start: {
          line: 27,
          column: 0
        },
        end: {
          line: 27,
          column: 48
        }
      }
    },
    fnMap: {
      "0": {
        name: "toggleState",
        decl: {
          start: {
            line: 5,
            column: 9
          },
          end: {
            line: 5,
            column: 20
          }
        },
        loc: {
          start: {
            line: 5,
            column: 23
          },
          end: {
            line: 24,
            column: 1
          }
        },
        line: 5
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 15,
            column: 4
          },
          end: {
            line: 23,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 15,
            column: 4
          },
          end: {
            line: 23,
            column: 5
          }
        }, {
          start: {
            line: 15,
            column: 4
          },
          end: {
            line: 23,
            column: 5
          }
        }],
        line: 15
      },
      "1": {
        loc: {
          start: {
            line: 20,
            column: 8
          },
          end: {
            line: 22,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 20,
            column: 8
          },
          end: {
            line: 22,
            column: 9
          }
        }, {
          start: {
            line: 20,
            column: 8
          },
          end: {
            line: 22,
            column: 9
          }
        }],
        line: 20
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "f30eb07d67bd6adc22c62d45721ceeafcd65b8c6"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_26ckrmpig = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_26ckrmpig();

/** Toggle focus mode: remove task list component and only show the Pomodoro timer */

/** The function is keep track of focus tasks and check if all the
 * tasks are complete.
  */
function toggleState() {
  cov_26ckrmpig().f[0]++;
  // elements -- popup button, task list div, pomodoro timer div, focus task
  // const popUpBtn = document.getElementById('popup-button');
  const taskListDiv = (cov_26ckrmpig().s[0]++, document.getElementById('task-list'));
  const pomoDiv = (cov_26ckrmpig().s[1]++, document.getElementById('pomodoro-timer'));
  const focusTask = (cov_26ckrmpig().s[2]++, document.getElementById('focus-task')); // popUpBtn.classList.toggle('state');

  cov_26ckrmpig().s[3]++;
  taskListDiv.classList.toggle('state');
  cov_26ckrmpig().s[4]++;
  pomoDiv.classList.toggle('state');
  cov_26ckrmpig().s[5]++;
  focusTask.classList.toggle('state');
  cov_26ckrmpig().s[6]++;

  if (localStorage.getItem('state') === 'default') {
    cov_26ckrmpig().b[0][0]++;
    cov_26ckrmpig().s[7]++;
    localStorage.setItem('state', 'focus');
  } else {
    cov_26ckrmpig().b[0][1]++;
    cov_26ckrmpig().s[8]++;
    localStorage.setItem('state', 'default');
    const title = (cov_26ckrmpig().s[9]++, document.getElementById('select-focus'));
    cov_26ckrmpig().s[10]++;

    if (title.innerHTML === 'All tasks complete!') {
      cov_26ckrmpig().b[1][0]++;
      cov_26ckrmpig().s[11]++;
      title.innerHTML = '';
    } else {
      cov_26ckrmpig().b[1][1]++;
    }
  }
}

const focusBtn = (cov_26ckrmpig().s[12]++, document.getElementById('focus-button'));
cov_26ckrmpig().s[13]++;
focusBtn.addEventListener('click', toggleState);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvY3VzTW9kZS5qcyJdLCJuYW1lcyI6WyJ0b2dnbGVTdGF0ZSIsInRhc2tMaXN0RGl2IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInBvbW9EaXYiLCJmb2N1c1Rhc2siLCJjbGFzc0xpc3QiLCJ0b2dnbGUiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2V0SXRlbSIsInRpdGxlIiwiaW5uZXJIVE1MIiwiZm9jdXNCdG4iLCJhZGRFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7Ozs7QUFmWjs7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTQSxXQUFULEdBQXVCO0FBQUE7QUFDbkI7QUFDQTtBQUNBLFFBQU1DLFdBQVcsNEJBQUdDLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixXQUF4QixDQUFILENBQWpCO0FBQ0EsUUFBTUMsT0FBTyw0QkFBR0YsUUFBUSxDQUFDQyxjQUFULENBQXdCLGdCQUF4QixDQUFILENBQWI7QUFDQSxRQUFNRSxTQUFTLDRCQUFHSCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsWUFBeEIsQ0FBSCxDQUFmLENBTG1CLENBTW5COztBQU5tQjtBQU9uQkYsRUFBQUEsV0FBVyxDQUFDSyxTQUFaLENBQXNCQyxNQUF0QixDQUE2QixPQUE3QjtBQVBtQjtBQVFuQkgsRUFBQUEsT0FBTyxDQUFDRSxTQUFSLENBQWtCQyxNQUFsQixDQUF5QixPQUF6QjtBQVJtQjtBQVNuQkYsRUFBQUEsU0FBUyxDQUFDQyxTQUFWLENBQW9CQyxNQUFwQixDQUEyQixPQUEzQjtBQVRtQjs7QUFVbkIsTUFBSUMsWUFBWSxDQUFDQyxPQUFiLENBQXFCLE9BQXJCLE1BQWtDLFNBQXRDLEVBQWlEO0FBQUE7QUFBQTtBQUM3Q0QsSUFBQUEsWUFBWSxDQUFDRSxPQUFiLENBQXFCLE9BQXJCLEVBQThCLE9BQTlCO0FBQ0gsR0FGRCxNQUVPO0FBQUE7QUFBQTtBQUNIRixJQUFBQSxZQUFZLENBQUNFLE9BQWIsQ0FBcUIsT0FBckIsRUFBOEIsU0FBOUI7QUFDQSxVQUFNQyxLQUFLLDRCQUFHVCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBSCxDQUFYO0FBRkc7O0FBR0gsUUFBSVEsS0FBSyxDQUFDQyxTQUFOLEtBQW9CLHFCQUF4QixFQUErQztBQUFBO0FBQUE7QUFDM0NELE1BQUFBLEtBQUssQ0FBQ0MsU0FBTixHQUFrQixFQUFsQjtBQUNILEtBRkQ7QUFBQTtBQUFBO0FBR0g7QUFDSjs7QUFFRCxNQUFNQyxRQUFRLDZCQUFHWCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBSCxDQUFkOztBQUNBVSxRQUFRLENBQUNDLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DZCxXQUFuQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBUb2dnbGUgZm9jdXMgbW9kZTogcmVtb3ZlIHRhc2sgbGlzdCBjb21wb25lbnQgYW5kIG9ubHkgc2hvdyB0aGUgUG9tb2Rvcm8gdGltZXIgKi9cbi8qKiBUaGUgZnVuY3Rpb24gaXMga2VlcCB0cmFjayBvZiBmb2N1cyB0YXNrcyBhbmQgY2hlY2sgaWYgYWxsIHRoZVxuICogdGFza3MgYXJlIGNvbXBsZXRlLlxuICAqL1xuZnVuY3Rpb24gdG9nZ2xlU3RhdGUoKSB7XG4gICAgLy8gZWxlbWVudHMgLS0gcG9wdXAgYnV0dG9uLCB0YXNrIGxpc3QgZGl2LCBwb21vZG9ybyB0aW1lciBkaXYsIGZvY3VzIHRhc2tcbiAgICAvLyBjb25zdCBwb3BVcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwb3B1cC1idXR0b24nKTtcbiAgICBjb25zdCB0YXNrTGlzdERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWxpc3QnKTtcbiAgICBjb25zdCBwb21vRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvbW9kb3JvLXRpbWVyJyk7XG4gICAgY29uc3QgZm9jdXNUYXNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZvY3VzLXRhc2snKTtcbiAgICAvLyBwb3BVcEJ0bi5jbGFzc0xpc3QudG9nZ2xlKCdzdGF0ZScpO1xuICAgIHRhc2tMaXN0RGl2LmNsYXNzTGlzdC50b2dnbGUoJ3N0YXRlJyk7XG4gICAgcG9tb0Rpdi5jbGFzc0xpc3QudG9nZ2xlKCdzdGF0ZScpO1xuICAgIGZvY3VzVGFzay5jbGFzc0xpc3QudG9nZ2xlKCdzdGF0ZScpO1xuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc3RhdGUnKSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzdGF0ZScsICdmb2N1cycpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzdGF0ZScsICdkZWZhdWx0Jyk7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdC1mb2N1cycpO1xuICAgICAgICBpZiAodGl0bGUuaW5uZXJIVE1MID09PSAnQWxsIHRhc2tzIGNvbXBsZXRlIScpIHtcbiAgICAgICAgICAgIHRpdGxlLmlubmVySFRNTCA9ICcnO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBmb2N1c0J0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb2N1cy1idXR0b24nKTtcbmZvY3VzQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlU3RhdGUpO1xuIl19
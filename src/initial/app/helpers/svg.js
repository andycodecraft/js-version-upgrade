import Ember from 'ember';

var h = function (value/*, options*/) {
    if (!value) {
        //return '';
        return new Ember.Handlebars.SafeString('<img src=\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgo8c3ZnCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4wIgogICB3aWR0aD0iNjc5LjQ3ODI3IgogICBoZWlnaHQ9Ijg4MS42NzI0OSIKICAgaWQ9InN2ZzExMzgyIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMTEzODQiIC8+CiAgPGcKICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDguOTA3NDg3LC01NS42MjU4ODUpIgogICAgIGlkPSJsYXllcjEiPgogICAgPGcKICAgICAgIGlkPSJnMTE0NzYiPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDQ3NC41MDg4OCw3MTguMjI4NDEgTCAzMDMuNDk1NDcsNzE4LjIyODQxIEwgMzAzLjQ5NTQ3LDY5NS45MjcwNyBDIDMwMy40OTUyMyw2NTcuOTc1OTkgMzA3Ljc5ODk5LDYyNy4xNjQ5NiAzMTYuNDA2NzcsNjAzLjQ5Mzg4IEMgMzI1LjAxNDA1LDU3OS44MjM1NiAzNDAuMDQwMjksNTU4LjIwNjkzIDM1Ny4wNjAwMSw1MzguNjQzOTIgQyAzNzQuMDc5MTUsNTE5LjA4MTgxIDM5OS4wNDczNSw1MTIuMzExMjggNDU4LjUxNzk0LDQ2My4wMTMwNyBDIDQ5MC4yMDg4OSw0MzcuMTkxMDQgNTEzLjc5OTI0LDM4NS44NjA3NyA1MTMuNzk5NjksMzY0LjM0MTMzIEMgNTE2LjAxMjAxLDMwNy40MTg4OCA0OTkuODU5ODYsMjg0Ljk5OTEzIDQ3OS4yMzY4MiwyNjQuMzc2MDkgQyA0NTYuNTYzMjcsMjQ0LjY5ODkyIDQxOC41NjY1NSwyMzQuMzA2MTEgMzg4LjIzNzksMjM0LjMwNjExIEMgMzYwLjQ1ODY5LDIzNC4zMDY4IDMxOS43NzA1NSwyNDIuMzk0ODIgMzAwLjQ3MTMsMjU5LjY3NjU4IEMgMjc0LjUzMzEzLDI3Ni45NTk2NiAyMzUuMjMzODMsMzMzLjM4MjY5IDI0My40MjQ0MywzOTAuMjIyMzUgTCA0OC45MDc0ODcsMzkxLjkyNDU3IEMgNDguOTA3NDg3LDIzNC43MTA1OCA3OC4zMDExODYsMTkzLjIyOTkyIDE0Ny45MTE2LDEyOC44OTQyNSBDIDIxNS4zMDg5OSw3NC41MTc2MDcgMjc0LjQ0Mjg4LDU1LjYyNTg4NSAzOTEuNzU5MTcsNTUuNjI1ODg1IEMgNDgxLjQ3NzA4LDU1LjYyNTg4NSA1NTMuNjU2NDUsNzMuNDI4Njk1IDYwNi4wODQ2OSwxMDkuMDMxNzQgQyA2NzcuMjkxODMsMTU3LjE1NjQ2IDcyOC4zODU3NCwyMjAuMjE1MjggNzI4LjM4NTc0LDMzOS4xNDQ1NSBDIDcyOC4zODUwNSwzODMuNDY1MzYgNzA5LjIzMzIxLDQyOS45MzA5MyA2ODUuMzEzMTQsNDY3LjQ3NzU0IEMgNjY2LjkyMzY3LDQ5OC4zODY5MiA2MjQuOTM4MDMsNTMzLjkyOTkgNTY3LjEwMDc3LDU3MS44OTM4MiBDIDUyNC4yNjQ3LDU5Ny42NjI0MiA1MDAuNDI4ODEsNjI1LjAxMzA4IDQ5MC4wNjExMyw2NDMuOTg4NDIgQyA0NzkuNjkyNSw2NjIuOTY0NDUgNDc0LjUwODQyLDY4Ny43MTEwOSA0NzQuNTA4ODgsNzE4LjIyODQxIEwgNDc0LjUwODg4LDcxOC4yMjg0MSB6ICIKICAgICAgICAgc3R5bGU9ImZvbnQtc2l6ZToxMjAxLjkyNDkyNjc2cHg7Zm9udC1zdHlsZTpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO3RleHQtYWxpZ246Y2VudGVyO3RleHQtYW5jaG9yOm1pZGRsZTtmaWxsOiMwMDAwMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjFweDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2Utb3BhY2l0eToxO2ZvbnQtZmFtaWx5OkJpdHN0cmVhbSBWZXJhIFNhbnMiCiAgICAgICAgIGlkPSJwYXRoMTE0NzIiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gNDgyLjM4Mjk4IDg2OS44MDkwMiBBIDk0LjA0MjU1NyA3My4wMjEyNzggMCAxIDEgIDI5NC4yOTc4Nyw4NjkuODA5MDIgQSA5NC4wNDI1NTcgNzMuMDIxMjc4IDAgMSAxICA0ODIuMzgyOTggODY5LjgwOTAyIHoiCiAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMTA2MzgzLC01LjUzMTkxNDkpIgogICAgICAgICBzdHlsZT0iZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDozO3N0cm9rZS1saW5lY2FwOnNxdWFyZTtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxIgogICAgICAgICBpZD0icGF0aDExNDc0IiAvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==\'/>');
    }

    return new Ember.Handlebars.SafeString('<img src=\'data:image/svg+xml;base64,' + window.btoa(value) + '\'/>');
};

export default h;


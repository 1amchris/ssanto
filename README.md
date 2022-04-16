# SSANTO

SSANTO is a spatial suitability analysis tool which helps visualize and optimize geographical problems.

## Description

SSANTO is a spatial suitability analysis tool which uses the techniques of GIS-MCDA (Geo-information systems and multi-criteria decision analysis) following multi-attribute value theory (MAVT). The main functionality is thus to generate colour-coded, raster-based maps that indicate suitability (scale between 0-1) for the implementation for a selected Nature-Based Solution (NBS), where dark red signifies low suitability (0) and green signifies high suitability (1). There are two separate analyses (that work identically in terms of the technical modelling approach) corresponding to the two sides of suitability (represented in suitability maps): opportunities and needs. Opportunities relate to those locations that are most suitable, while needs relate to those locations where the benefits are needed most. More information about SSANTO can be found in Kuller et al. (2019a). The goal is to develop SSANTO as a stand-alone and open-source software, using only open-source dependencies.

<!-- ## Badges

On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge. -->

<!-- ## Visuals

Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method. -->

## Getting Started

### Install dependencies

To get started, you will need the following dependencies:

- [NodeJS LTS](https://nodejs.org/en/)
- [Python 3.8+](https://www.python.org/downloads/)
- [GDAL 3.4+](https://gdal.org/download.html)

---

First, to install all required node dependencies, run

```sh
npm install
```

Then, to install all required python dependencies, run

```sh
pip install -r requirements.txt
```

Finally, you need to install GDAL's dependencies:

```sh
pip install gdal
```

Unfortunately, the GDAL python package doesn't install easily for Windows users. If this is your case, try using this [unofficial list of Windows Binaries for Python Extension Packages](https://www.lfd.uci.edu/~gohlke/pythonlibs/#gdal) to install it manually. In there, you should find success. Just make sure the version you're installing matches your system's architecture as well as the currently installed version of python/pip on your machine.

### Launch SSANTO

If you've already made sure everything is installed properly, you may run the application:

```sh
npm start
```

This should launch the server, launch the client and open an electron GUI. If not, check the command-line. Something might not work as expected; see [Troubleshooting](#troubleshooting).

### Troubleshooting

If something doesn't work as expected, here are a couple ideas

#### Dependencies:

You should double and triple check that you have succesfully installed all required dependencies; see [Install Dependencies](#install-dependencies).

## Usage

See the in-app guide: in the menu bar, under `Help > Show guide`.

<!-- ## Support

Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc. -->

<!-- ## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README. -->

## Contributing

State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment

Authors of SSANTO: Martijn Kuller et al.

Development initiative: Françoise Bichai

Development team:

- Christophe Beaulieu
- Louis Plessis
- Philippe Maisonneuve
- Tristan Rioux
- Frédérique Roy

## License

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## Project status

We are currently looking for volunteers to improve and maintain the project. If interested, you may fork the project, and propose an update by submitting a pull-request.

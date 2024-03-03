# How to use

Albeit the folder hierarchy has been followed, We have added, at the root of this
repository, a general script that will facilitate the execution of the defense.

1. Install the Darkly.iso into a VM. The installation is really ease, you do not
   have really to set things for working. It takes less than 5 minutes to
   install and start the VM
2. Since it starts, it gives you the ip to use for performing the defense.
   Inside all the project's documentation we refer to this ip as `ip_darkly`.
3. At the root of this folder you will found a bash script linked to all others
   resources' scripts. It means that you can go on every folder and run the
   script independently of this main script. All have the forms of `./script.sh
   ip_darkly`, so do not forgot to notice this info!

## For running the main tester:

`./get_the_darkly_flags.sh ip_darkly`   

A menu will let you choose which test you want to run, or all in one or just
displaying the 14 flags earned.

Enjoy our Darkly

### Authors
Powered by: `gphilipp` and `alellouc` from 42 Nice Campus.

## Resources

All the datas used can be retrieved on the [OWASP WEBSITE](https://owasp.org/).

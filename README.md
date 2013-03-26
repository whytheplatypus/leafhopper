Basic usage:

run
```
cd <whatever directory you want>
leaf
```
on any nodes you want to distribute to.

then on the machiene you're developing on in the directory of the node project
you want to distribute.

for each node `hopper add <url of node>`  
and then `hopper push <branch name>`, branch name will probably be master.

That should push to all the nodes you added, run npm install then run what you 
have as a start script in the package.json

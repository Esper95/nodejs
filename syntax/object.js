var members = ['egoing','k8005','hoya'];

console.log(members[1]);

var roles = {'programer':'egoing',
             'designer' : 'k8805',
             'manager' : 'hoya'}

console.log(roles.designer);

var i =0;
while (i < members.length) {
    console.log(members[i]);
    i+=1 ;
}

for ( var name in roles){
    console.log('object =>', name,
    'value =>' , roles[name] );
}
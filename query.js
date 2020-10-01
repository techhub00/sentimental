var express =require('express');
var app=express();
var path=require('path');
var layout =require('express-layout');
var engine=require('ejs-mate');
var bodyparser=require('body-parser');
const mongoose = require('mongoose');
var Publishable_Key = 'pk_test_KN0KLR7P8xvgBgYqGHt9IdC5'
var Secret_Key = 'sk_test_51HIM83DMag5txVHt03lxIgLZzCuf4NsbRjbihAkUzLK4AhzH6XC1nfcVAwdN8wgEBwx8SffWnff34eNYCBTgDIID00Z2IegY4G'
var nodemailer = require('nodemailer');

const stripe = require('stripe')(Secret_Key);
mongoose.connect('mongodb://localhost:27017/flowify', 
{	useNewUrlParser: true,
	useUnifiedTopology: true,
})

.then(() => console.log('Monogdb Connected...'))
.catch(err => console.log(err));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended:true
}))
const formidable = require('formidable');
const uniqueString = require('unique-string');
const multer = require('multer');
var axios= require('axios');
const FormData = require('form-data');

(async ()=>{
			
                    axios.post('https://us-central1-kycify.cloudfunctions.net/spider-licenseApi-checkLisence', {
                    fname: 'Matthew',
                    lname: 'Smith',
                    mname: 'Charles',
                    dob: '05-17-1989',
                    financeamount: 2000,
                    number: 'Dh272401',
                    version: 143
                    })
                    .then((response) => {
                      console.log(response.data);
                    }, (error) => {
                      console.log(error);
                    })
                  })()              

var logo="";
var background="";
var item_pic="";
var check=0;
var storage =   multer.diskStorage({
	destination: function (req, file, callback) {
		
		var dir=path.join('./public/Files/'+req.session.user_id);
		if (fs.existsSync(dir)){
		callback(null, dir);
		}
		else
		{
			fs.mkdirSync(dir);
			callback(null, dir);
		}
	},
	filename: function (req, file, callback) {
    if(check==0)
    {
		logo='flowify' + uniqueString() +file.originalname.toLowerCase().split(' ').join('-')
  	callback(null , logo );  
    }
    else if(check>0)
    {
      item_pic='flowify' + uniqueString() +file.originalname.toLowerCase().split(' ').join('-')
      callback(null , item_pic );
    }
check++;
	
	}
});

var upload = multer({ storage : storage}).array('userfile');
var item_1="none";
var item_2="none";
var item_3="none";
var item_4="none";
var ch=0;
var storage_item =   multer.diskStorage({
	destination: function (req, file, callback) {
		
		var dir=path.join('./public/Files/'+req.session.user_id);
		if (fs.existsSync(dir)){
		callback(null, dir);
		}
		else
		{
			fs.mkdirSync(dir);
			callback(null, dir);
		}
	},
	filename: function (req, file, callback) {
    if(ch==0)
    {
		item_1='flowify' + uniqueString() +file.originalname.toLowerCase().split(' ').join('-')
  	callback(null , item_1 );  
    }
    else if(ch==1)
    {
      item_2='flowify' + uniqueString() +file.originalname.toLowerCase().split(' ').join('-')
      callback(null , item_2 );
    }
    else if(ch==2)
    {
      item_3='flowify' + uniqueString() +file.originalname.toLowerCase().split(' ').join('-')
      callback(null , item_3 );
    }
    else if(ch==3)
    {
      item_4='flowify' + uniqueString() +file.originalname.toLowerCase().split(' ').join('-')
      callback(null , item_4 );
    }
ch++;
	
	}
});
var upload_item = multer({ storage : storage_item}).array('userfile');







require('./models/Flowify_User');
  const Flowify_User = mongoose.model('flowify_user');

  require('./models/Flowify_Widget');
  const Flowify_Widget = mongoose.model('flowify_widget');
  require('./models/Just_buyer_register');
  const Just_buyer_register = mongoose.model('just_buyer_register');
  require('./models/Buyer_Register');
  const Buyer_Register = mongoose.model('buyer_register');
  require('./models/Finance');
  const Finance = mongoose.model('finance');
  require('./models/Passport');
  const Passport = mongoose.model('passport');
  require('./models/Item');
  const Item = mongoose.model('item');
  
  const session = require('express-session');
  var url = require('url');
  
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

app.get('/confirm',function(req,res){
  (async ()=>{
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  console.log(query.code)
  const response = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code: query.code,
  });
  
  var connected_account_id = response.stripe_user_id;
  console.log('account_id: '+ connected_account_id)


  })()
  });







/*
  const transfer = await stripe.transfers.create({
    amount: 1*100,
    currency: 'nzd',
    destination: 'acct_1HJzdRAyP8YPE0S0',
    transfer_group: 'ORDER_95',
  });
 
 */ 

app.post('/charge', function(req, res){ 

console.log("Total item Price: "+req.body.amount)
console.log("Total item Price included tex: "+req.body.total)
  var t=req.body.total;
  var five_p=((5/100)*t).toFixed(2);

  console.log(req.body.stripeToken);
  stripe.customers.create({ 
      email: req.body.email, 
      source: req.body.stripeToken, 
      name: req.body.buyer_name,
  }) 
  .then((customer) => { 
    (async ()=>{
    const paymentIntent = stripe.paymentIntents.create({
      amount: req.body.total*100,
      currency: 'nzd',
      payment_method_types: ['card'],
      application_fee_amount:parseInt(five_p*100),
      on_behalf_of: 'acct_1HK3ltFRIU65lhjK',
      transfer_data: {
        destination: 'acct_1HK3ltFRIU65lhjK',
      },
    });
  })();
        
}) 
  .then((charge) => { 
    
    Flowify_Widget.findOne({_id:req.body.id},function(err,found){
      if(found)
      {
        Flowify_User.findOne({_id:found.User_Id},function(err,user){
          console.log(user.Stripe_Account);//acct_1HAgBBIOL4i7Ppx6
         /* (async ()=>{
            const transfer = await stripe.transfers.create({
              amount: five_p*100,
              currency: 'nzd',
              destination: user.Stripe_Account,
              transfer_group: 'ORDER_95',
            });
            })();
            */
            var buyer_reg=new Buyer_Register();
            buyer_reg.Buyer_Name=req.body.buyer_name;
            buyer_reg.Buyer_Cell=req.body.buyer_phone;
            buyer_reg.Buyer_Address=req.body.buyer_address;
            buyer_reg.Buyer_Email=req.body.email;
            buyer_reg.Purchased=req.body.amount;
            buyer_reg.save(function(err) {
            })
            var transporter = nodemailer.createTransport({
              service: 'Gmail',
              host: 'smtp.gmail.com',
              port: 587,
              secure: false,
              requireTLS: true,
              auth: {
                user: 'info.evotinghyperledgerfabric@gmail.com',
                pass: 'moonchand786'
              },
              tls: {
                rejectUnauthorized: false
              }
            });
            var mailOptions = {
              from: 'Flowify',
              to:req.body.email,
              subject: 'Order Confirmed',
              html:'<div style="background:#111e6c;color:#fff;border: solid 1px #111e6c"><center><h2>Your payment is successfully received</h2><h3>your product will deliver very soon</h3></cener></div>'
            }
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent to buyer: ' + info.response);
              }
            });
            //////////////////////////////widget cretor emial//////////////
            var transporter2 = nodemailer.createTransport({
              service: 'Gmail',
              host: 'smtp.gmail.com',
              port: 587,
              secure: false,
              requireTLS: true,
              auth: {
                user: 'info.evotinghyperledgerfabric@gmail.com',
                pass: 'moonchand786'
              },
              tls: {
                rejectUnauthorized: false
              }
            });

            var mailOptions2 = {
              from: 'Flowify',
              to:user.Email,
              subject: 'product info',
              html:'<div style="background:#111e6c;color:#fff;border: solid 1px #111e6c"><center><h2>Your One Prouct is purchased against this id ('+found._id+') </h2><h3>Your Buyer info are following</h3><div>Buyer Name: '+req.body.buyer_name+'</div><div>Buyer Cell: '+req.body.buyer_phone+'</div><div>Buyer Email: '+req.body.email+'</div><div>Collection Address: '+req.body.buyer_address+'</div></center></div>'
            }
            transporter2.sendMail(mailOptions2, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent to widget creator: ' + info.response);
              }
            });



              res.render('payment_success',{
                errors:{},
                Data:found,
                success:{},   
             })
          })
       }
    })
       
  })
  .catch((err) => { 
    res.send(err) 
});
  

/*
stripe.transfers.create(
    {
      amount: 400,
      currency: 'usd',
      destination: 'acct_1GwoGeEwRqsIKHiX',
      transfer_group: 'ORDER_95',
    },
    function(err, transfer) {
      // asynchronously called
    })
    .then((charge) => { 
      res.send("Success") // If no error occurs 
  })
  .catch((err) => { 
      res.send(err)       // If some error occurs 
  });
*/



}) 





app.get('/stripe_account_verifcation/:user_id',function(req,res){

  Flowify_User.findOne({_id: req.params.user_id},function(err,found){
        
    if(found)
    {
        if(found.Stripe_Account_Verification=="false")
        {
          found.Stripe_Account_Verification="true";
         
          found.save(function(err) {
          })
          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
              user: 'info.evotinghyperledgerfabric@gmail.com',
              pass: 'moonchand786'
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          var mailOptions = {
            from: 'Flowify',
            to:found.Email,
            subject: 'Account Activation',
            html:'<div style="background:#111e6c;color:#fff;border: solid 1px #111e6c"><center><h2>Your account is Suceesfully Actived </h2><h3>Now you can create new widget</h3>'
          }
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
         var success=[];
        success.push("Widget creator account successfully activated against ("+req.params.user_id+") this id")
         res.render('stripe_c',{
           errors:{},
           success:success
         })
  
  
        }
        else
        {
        var errors=[];
          errors.push("Sorry widget creator's account is already activated against ("+found._id+") this id")
           res.render('stripe_c',{
             errors:errors,
             success:{}
           })

        }

    }
    else
    {
      var errors=[];
      errors.push("Sorry No User Found against ("+req.params.id+") this id")
       res.render('stripe_c',{
         errors:errors,
         success:{}
       })
    }
  });


})


  app.post('/register_c',function(req,res){
   
  
    
    var errors=[];
    if(!req.body.fname)
    {
      errors.push("Plz Choose First Name");
    }
    if(!req.body.lname)
    {
      errors.push("Plz Choose Last Name");
    }
    if(!req.body.email)
    {
      errors.push("Plz choose Email");
    }
    if(!req.body.pass)
    {
      errors.push("Plz choose Password");
    }
   
    
    if(errors.length>0)
    {
      res.render('register_panel',{
        errors:errors,
        success:{},
        account:"ok",
        account_id:{}
      })
    }
    else
    {

      Flowify_User.findOne({Email: req.body.email},function(err,found){
        
        if(found)
        {
            errors.push("Sorry this( "+ req.body.email +" ) Email is Already Registered");
            res.render('register_panel',{
              errors:errors,
              success:{},
              account:"ok",
              account_id:req.body.c_a_id
              
            });
  
        }
        else
        {
         
          console.log(req.body.c_a_id)

          var flowify_user=new Flowify_User();
          
          flowify_user.First_Name=req.body.fname;

          flowify_user.Last_Name=req.body.lname;

          flowify_user.Email=req.body.email;
          flowify_user.Password=req.body.pass;
          flowify_user.Stripe_Account=req.body.c_a_id;
          flowify_user.Stripe_Account_Verification="true";
          flowify_user.Login_Status='Offline';
          flowify_user.Country='None';
          flowify_user.Picture='user.jpg';
       
          flowify_user.save(function(err) {
          
  
            if (err>0)
            {
            res.end(err);
            }
            else
            {
              
              Flowify_User.findOne({Email: req.body.email},function(err,found){
              console.log(found);
                var transporter = nodemailer.createTransport({
                service: 'Gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                  user: 'info.evotinghyperledgerfabric@gmail.com',
                  pass: 'moonchand786'
                },
                tls: {
                  rejectUnauthorized: false
                }
              });
              var mailOptions = {
                from: 'Flowify',
                to:'Flowifyowner999@gmail.com',
                subject: 'Signup Info',
                html:'<div style="background:#111e6c;color:#fff;border: solid 1px #111e6c"><center><h2>New User Suceesfully Created </h2><h3>Record of user is following</h3><div>First Name: '+req.body.fname+'</div><div>Last Name: '+req.body.lname+'</div><div style="color:#fff">Email Address: '+req.body.email+'</div><div>Stripe Account id: '+req.body.c_a_id+'</div></center><h3 style="color:#fff;margin-left:10px">Click to below link to active widget creator account </h3><h4>http://localhost:3001/stripe_account_verifcation/'+found._id+'/</h4></div>'
              }
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });






              var success=[];
              console.log("user register successfully");
              success.push("You are Successfully Registered")
              res.render('index',{
                success:success,
                errors:{}
              })
            })
            }
          });
  
  
          /*
          
             */
            }
    });
      
    }
    
  });
  app.post('/new_widget_c',function(req,res){
   check=0;
   logo="";
   item_pic="none";
    new formidable.IncomingForm().parse(req, (err, fields, files) => {
		 
    var errors=[];
   
    if(!fields.name)
    {
      errors.push("Plz Choose Widget Name");
    }
    if(!fields.width)
    {
      errors.push("Plz Choose Width");
    }
    if(!fields.height)
    {
      errors.push("Plz choose hight");
    }
    if(!fields.start_btn_text)
    {
      errors.push("Plz choose start btn text ");
    }
    if(!fields.confirm_btn_text)
    {
      errors.push("Plz choose start btn text ");
    }
    if(!fields.heading)
    {
      errors.push("Plz choose heading ");
    }
    if(!fields.sub_heading)
    {
      errors.push("Plz choose sub heading ");
    }
    if(!fields.page2_heading)
    {
      errors.push("Plz choose page2 heading ");
    }
    if(!fields.page2_sub_heading)
    {
      errors.push("Plz choose page2 sub heading ");
    }
    if(!fields.confirmation_text)
    {
      errors.push("Plz choose confirmation text ");
    }
    
    if(errors.length>0)
    {
      res.render('new_widget',{
        errors:errors,
        success:{},
        Widget:{},
      })
    }
  });
    
      upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        else
        {
          
            var flowify_widget=new Flowify_Widget();
            flowify_widget.User_Id=req.session.user_id;
  
            flowify_widget.Name=req.body.name;
  
            flowify_widget.Pre_Build= req.body.pre_build;
            
            flowify_widget.Responsive=req.body.responsive
            
            flowify_widget.Theme_Light=req.body.theme_light;
            
            flowify_widget.Width=req.body.width;
            
            flowify_widget.Height=req.body.height;
            
            flowify_widget.Nav_Btn_Color=req.body.nav_btn_color;
            
            flowify_widget.Nav_Btn_Text_Color=req.body.nav_btn_text_color;
  
            flowify_widget.Text_Color=req.body.text_color;
            
            flowify_widget.Btn_Border=req.body.btn_border
            
            flowify_widget.Start_Btn_Text=req.body.start_btn_text;
            
            flowify_widget.Confirm_Btn_Text=req.body.confirm_btn_text;
            
            flowify_widget.Heading=req.body.heading;
            
            flowify_widget.Sub_Heading=req.body.sub_heading;
            
            flowify_widget.Page2_Heading=req.body.page2_heading;
            
            flowify_widget.Page2_Sub_Heading=req.body.page2_sub_heading;
            
            flowify_widget.Confirmation_Text=req.body.confirmation_text;
            
            flowify_widget.Logo='Files/'+req.session.user_id+'/' +logo;
            
            flowify_widget.Background='Files/'+req.session.user_id+'/'+background;
  
            
           
            flowify_widget.Unique_Id=req.body.ukey;
            flowify_widget.save(function(err) {
    
              if (err>0)
              {
              res.end(err);
              }
              else
              {
                Flowify_Widget.findOne({Unique_Id:req.body.ukey},function(err,found){
                  if(found)
                  {
                    res.redirect('/widget_update/'+found._id)
                          
                  }
                })
              }
            });

           
       
           
         
        }
      });
      

    
 
    
  });

  app.post('/buyer_register_c',function(req,res){
    
      var errors=[];
   
    if(!req.body.buyer_name)
    {
      errors.push("Plz Choose your name");
    }
    if(!req.body.buyer_phone)
    {
      errors.push("Plz Choose your cell number");
    }
    if(errors.length>0)
    {
      Flowify_Widget.findOne({_id:req.body.id},function(err,found){
        if(found)
        {
          Flowify_User.findOne({_id:req.session.user_id},function(err,user){
              if(user)
              {
                res.render('buyer_register',{
                  errors:errors,
                  Data:found,
                  User:user,
                  success:{}   
               })
             }
          })
        }
      })
    }
    else
    {
      Buyer_Register.findOne({Phone:req.body.buyer_phone},function(err,user){
        if(user)
        {
          Flowify_Widget.findOne({_id:req.body.id},function(err,data){
            if(data)
            {
              var errors=[];
              errors.push("Sorry this ("+req.body.buyer_phone+") Nubmer is Already Exist");
              res.render('buyer_register',{
                errors:errors,
                Data:data,
                User:user,
                success:{}   
             })
           }
        })
        }
        else
        {
            var buyer_regiser=new Just_buyer_register();
            buyer_regiser.Name=req.body.buyer_name;
            buyer_regiser.Phone=req.body.buyer_phone;
            buyer_regiser.save(function(err) {
              if (err>0)
              {
              res.end(err);
              }
              else
              {
                Flowify_Widget.findOne({_id:req.body.id},function(err,found){
                  if(found)
                  {
                    res.render('confirm',{
                      Data:found
                    })
                  }
                });
              }
            });
         }
       });

    }
    
  });




const routes=require('./routes');

var middleware=[
	layout(),
	express.static(path.join(__dirname,'public'))
]


app.use(middleware);
app.engine('ejs',engine);
app.set('view engine','ejs');

const fs = require("fs")
try {
	const arrayOfFiles = fs.readdirSync("./public")
	console.log(arrayOfFiles)
  } catch(e) {
	console.log(e)
  }

  
app.use('/',routes);
app.get('/',function(req,res){
if(req.session.user_id)
{
  res.redirect('/user-dash-board');
}
else
{
res.render('index',{
  errors:{},
  success:{}
})
}
});
app.get('/register_panel',function(req,res){

  (async ()=>{
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(query.code)
    if(query.code)
    {
        const response = await stripe.oauth.token({
          grant_type: 'authorization_code',
          code: query.code,
        });
        
        var connected_account_id = response.stripe_user_id;
        console.log('account_id: '+ connected_account_id)
      res.render('register_panel',{
        errors:{},
        success:{},
        account:"ok",
        account_id:connected_account_id,
      })
    }
    else if(query.error)
    {
      res.render('register_panel',{
        errors:error,
        success:{},
        account:"none",
        account_id:{}
      })

    }
    else
    {
      res.render('register_panel',{
        errors:{},
        success:{},
        account:"none",
        account_id:{}
      })

    }
})()
  });

  


  app.get('/user-dash-board',function(req,res){
  if(req.session.user_id)
  {
      
    Flowify_Widget.find({User_Id:req.session.user_id},function(err,widget){
			if(widget)
			{
      
        Flowify_User.findOne({_id:req.session.user_id},function(err,user){
          if(user)
          {
                
            console.log(widget);
            console.log(user)
            res.render('user-dash-board',{
              errors:{},
              Widget:widget,
              User:user,
              success:{},
              key: Publishable_Key
            })
          }
        })
      }
    });
  }
  else
  {
    res.redirect('/')
  }
});
app.get('/user_profile',function(req,res){
  if(req.session.user_id)
  {
    
        Flowify_User.findOne({_id:req.session.user_id},function(err,user){
          if(user)
          {

           
            console.log(user)
            res.render('user_profile',{
              errors:{},
              User:user,
              success:{},
             
            })
          }
        })
     
  }
  else
  {
    res.redirect('/')
  }
});
app.get('/new_widget',function(req,res){
  if(req.session.user_id)
  {
    Flowify_User.findOne({_id:req.session.user_id},function(err,user){
      if(user)
      {

        var ukey=uniqueString();
        res.render('new_widget',{

          errors:{},
          User:user,
          ukey:ukey,
          ad:"none",
          success:{},
          Widget:{}
        })
      }
    })
  }
  else
  {
    res.redirect('/')
  }
});
app.get('/ad_item/:id',function(req,res){
  if(req.session.user_id)
  {
    Flowify_User.findOne({_id:req.session.user_id},function(err,user){
      if(user)
      {

        res.render('ad_item',{


          errors:{},
          widget_id:"none",
          User:user,
          ukey:req.params.id,
          success:{},
          Widget:{}
        })
      }
    })
  }
  else
  {
    res.redirect('/')
  }
});
app.get('/u_ad_item/:id/:widget_id',function(req,res){
  if(req.session.user_id)
  {
    Flowify_User.findOne({_id:req.session.user_id},function(err,user){
      if(user)
      {

        res.render('ad_item',{


          errors:{},
          User:user,
          widget_id:req.params.widget_id,
          ukey:req.params.id,
          success:{},
          Widget:{}
        })
      }
    })
  }
  else
  {
    res.redirect('/')
  }
});


app.get('/update_item/:id',function(req,res){
  if(req.session.user_id)
  {
    Flowify_User.findOne({_id:req.session.user_id},function(err,user){
      if(user)
      {

        Item.findOne({_id:req.params.id},function(err,found){
          if(found)
          {


        res.render('update_item',{


          errors:{},
          User:user,
          widget_id:"none",
          ad:found,
          success:{},
          Widget:{}
        })
      }
    })
      }
    })
  }
  else
  {
    res.redirect('/')
  }
});
app.get('/u_update_item/:id/:w_key',function(req,res){
  if(req.session.user_id)
  {
    Flowify_User.findOne({_id:req.session.user_id},function(err,user){
      if(user)
      {

        Item.findOne({_id:req.params.id},function(err,found){
          if(found)
          {


        res.render('update_item',{


          errors:{},
          User:user,
          widget_id:req.params.w_key,
          ad:found,
          success:{},
          Widget:{}
        })
      }
    })
      }
    })
  }
  else
  {
    res.redirect('/')
  }
});
app.post('/ad_item_c',function(req,res){
  ch=0;
  item_1="none";
  item_2="none";
  item_3="none";
  item_4="none";
  if(req.session.user_id)
  {
    Flowify_User.findOne({_id:req.session.user_id},function(err,user){
      if(user)
      {
        upload_item(req,res,function(err) {
          if(err) {
              return res.end("Error uploading file.");
          }
          else
          {
            var item_info=new Item();
            item_info.Ukey=req.body.ukey;
            item_info.Item_Title=req.body.item_title;
            item_info.Item_Sub_Title=req.body.item_sub_title;
            item_info.Item_Color=req.body.color;
            item_info.Price=req.body.price;
            item_info.Qty=req.body.quantity;
            item_info.Item_Sale=req.body.sale;
            if(item_1=="none")
            {
               item_info.Picture_1="none";
            }
            else
            {
              item_info.Picture_1='Files/'+req.session.user_id+'/'+item_1;
              console.log(item_1);
            }
            if(item_2=="none")
            {
               item_info.Picture_2="none";
            }
            else
            {
              item_info.Picture_2='Files/'+req.session.user_id+'/'+item_2;
            }
            if(item_3=="none")
            {
               item_info.Picture_3="none";
            }
            else
            {
              item_info.Picture_3='Files/'+req.session.user_id+'/'+item_3;
            }
            if(item_4=="none")
            {
               item_info.Picture_4="none";
            }
            else
            {
              item_info.Picture_4='Files/'+req.session.user_id+'/'+item_4;
            }

            item_info.save(function(err) {
              Item.find({Ukey:req.body.ukey},function(err,found){
                if(found)
                {
              res.render('new_widget',{

                errors:{},
                User:user,
                ukey:req.body.ukey,
                ad:found,
                success:{},
                Widget:{}
              })
            }
          })
            }) 
         }
    })



      }
    })
  }
  else
  {
    res.redirect('/')
  }
});
app.post('/u_ad_item_c',function(req,res){
  ch=0;
  item_1="none";
  item_2="none";
  item_3="none";
  item_4="none";
  if(req.session.user_id)
  {
    Flowify_User.findOne({_id:req.session.user_id},function(err,user){
      if(user)
      {
        upload_item(req,res,function(err) {
          if(err) {
              return res.end("Error uploading file.");
          }
          else
          {
            var item_info=new Item();
            item_info.Ukey=req.body.ukey;
            item_info.Item_Title=req.body.item_title;
            item_info.Item_Sub_Title=req.body.item_sub_title;
            item_info.Item_Color=req.body.color;
            item_info.Price=req.body.price;
            item_info.Qty=req.body.quantity;
            item_info.Item_Sale=req.body.sale;
            if(item_1=="none")
            {
               item_info.Picture_1="none";
            }
            else
            {
              item_info.Picture_1='Files/'+req.session.user_id+'/'+item_1;
              console.log(item_1);
            }
            if(item_2=="none")
            {
               item_info.Picture_2="none";
            }
            else
            {
              item_info.Picture_2='Files/'+req.session.user_id+'/'+item_2;
            }
            if(item_3=="none")
            {
               item_info.Picture_3="none";
            }
            else
            {
              item_info.Picture_3='Files/'+req.session.user_id+'/'+item_3;
            }
            if(item_4=="none")
            {
               item_info.Picture_4="none";
            }
            else
            {
              item_info.Picture_4='Files/'+req.session.user_id+'/'+item_4;
            }

            item_info.save(function(err) {
              Flowify_Widget.findOne({_id:req.body.widget_id},function(err,f){
                if(f)
                {
              Item.find({Ukey:f.Unique_Id},function(err,found){
                if(found)
                {
              res.render('widget_update',{

                errors:{},
                User:user,
                Data:f,
                
                ad:found,
                success:{},
                Widget:{}
              })
            }
          })
        }
      })
            }) 
         }
    })



      }
    })
  }
  else
  {
    res.redirect('/')
  }
});
app.post('/update_item_c',function(req,res){
  ch=0;
  item_1="none";
  item_2="none";
  item_3="none";
  item_4="none";
  if(req.session.user_id)
  {
    Flowify_User.findOne({_id:req.session.user_id},function(err,user){
      if(user)
      {
        upload_item(req,res,function(err) {
          if(err) {
              return res.end("Error uploading file.");
          }
          else
          {
            Item.findOne({_id:req.body.id},function(err,item_info){
              if(item_info)
              {
            console.log(item_info)
            item_info.Item_Title=req.body.item_title;
            item_info.Item_Sub_Title=req.body.item_sub_title;
            item_info.Item_Color=req.body.color;
            item_info.Price=req.body.price;
            item_info.Qty=req.body.quantity;
            item_info.Item_Sale=req.body.sale;
            if(item_1=="none")
            {
              if(req.body.pic_1=="none")
               item_info.Picture_1="none";
               else
               item_info.Picture_1=req.body.pic_1;
            }
            else
            {
              item_info.Picture_1='Files/'+req.session.user_id+'/'+item_1;
              console.log(item_1);
            }
            if(item_2=="none")
            {
              if(req.body.pic_2=="none")
              item_info.Picture_2="none";
              else
              item_info.Picture_2=req.body.pic_2;
            }
            else
            {
              item_info.Picture_2='Files/'+req.session.user_id+'/'+item_2;
            }
            if(item_3=="none")
            {
              if(req.body.pic_3=="none")
              item_info.Picture_3="none";
              else
              item_info.Picture_3=req.body.pic_3;
            }
            else
            {
              item_info.Picture_3='Files/'+req.session.user_id+'/'+item_3;
            }
            if(item_4=="none")
            {
              if(req.body.pic_4=="none")
              item_info.Picture_4="none";
              else
              item_info.Picture_4=req.body.pic_4;
            }
            else
            {
              item_info.Picture_4='Files/'+req.session.user_id+'/'+item_4;
            }

            item_info.save(function(err) {
                    Item.find({Ukey:req.body.ukey},function(err,found){
                      if(found)
                      {
                        console.log(found)
                        res.render('new_widget',{

                      errors:{},
                      User:user,
                      ukey:req.body.ukey,
                      ad:found,
                      success:{},
                      Widget:{}
                    })
                  }
                })




            }) 
              }
            })  

         }
    })



      }
      
      
    })
  }
  else
  {
    res.redirect('/')
  }
});
app.post('/u_update_item_c',function(req,res){
  ch=0;
  item_1="none";
  item_2="none";
  item_3="none";
  item_4="none";
  if(req.session.user_id)
  {
    Flowify_User.findOne({_id:req.session.user_id},function(err,user){
      if(user)
      {
        upload_item(req,res,function(err) {
          if(err) {
              return res.end("Error uploading file.");
          }
          else
          {
            Item.findOne({_id:req.body.id},function(err,item_info){
              if(item_info)
              {
            console.log(item_info)
            item_info.Item_Title=req.body.item_title;
            item_info.Item_Sub_Title=req.body.item_sub_title;
            item_info.Item_Color=req.body.color;
            item_info.Price=req.body.price;
            item_info.Qty=req.body.quantity;
            item_info.Item_Sale=req.body.sale;
            if(item_1=="none")
            {
              if(req.body.pic_1=="none")
               item_info.Picture_1="none";
               else
               item_info.Picture_1=req.body.pic_1;
            }
            else
            {
              item_info.Picture_1='Files/'+req.session.user_id+'/'+item_1;
              console.log(item_1);
            }
            if(item_2=="none")
            {
              if(req.body.pic_2=="none")
              item_info.Picture_2="none";
              else
              item_info.Picture_2=req.body.pic_2;
            }
            else
            {
              item_info.Picture_2='Files/'+req.session.user_id+'/'+item_2;
            }
            if(item_3=="none")
            {
              if(req.body.pic_3=="none")
              item_info.Picture_3="none";
              else
              item_info.Picture_3=req.body.pic_3;
            }
            else
            {
              item_info.Picture_3='Files/'+req.session.user_id+'/'+item_3;
            }
            if(item_4=="none")
            {
              if(req.body.pic_4=="none")
              item_info.Picture_4="none";
              else
              item_info.Picture_4=req.body.pic_4;
            }
            else
            {
              item_info.Picture_4='Files/'+req.session.user_id+'/'+item_4;
            }

            item_info.save(function(err) {
              Flowify_Widget.findOne({_id:req.body.w_key},function(err,f){
                if(f)
                {
                      Item.find({Ukey:f.Unique_Id},function(err,item){
                        if(item)
                        {
                      
                      res.render('widget_update',{
                        errors:{},
                        Data:f,
                        ad:item,
                        User:user,
                        success:{} 
                        })
                      }
                      })
                    }
               
              })

            }) 
              }
            })  

         }
    })



      }
      
      
    })
  }
  else
  {
    res.redirect('/')
  }
});

app.get('/item_delete/:id/:ukey',function(req,res,next){
  if(req.session.user_id)
  {
    Flowify_User.findOne({_id:req.session.user_id},function(err,user){
      if(user)
      {
        Item.find({_id: req.params.id}).remove()
        .exec(function(err,foundpin){
            
          
        })
                console.log("aahahahahahh")
                
                  Item.find({Ukey:req.params.ukey},function(err,found){
                    if(found)
                    {
                      res.render('new_widget',{
                      errors:{},
                      User:user,
                      ukey:req.params.ukey,
                      ad:found,
                      success:{},
                      Widget:{}
                    })
                  }
                  else
                  {
                    res.render('new_widget',{
                      errors:{},
                      User:user,
                      ukey:req.params.ukey,
                      ad:"",
                      success:{},
                      Widget:{}
                    })

                  }
              })    
                

                
        }
      })
  }
  else
  {
    res.redirect('/');
  }
});

app.get('/u_item_delete/:id/:widget_id',function(req,res,next){
  if(req.session.user_id)
  {
    Flowify_User.findOne({_id:req.session.user_id},function(err,user){
      if(user)
      {
        Item.find({_id: req.params.id}).remove()
        .exec(function(err,foundpin){
            
          
        })
                console.log("aahahahahahh")
                Flowify_Widget.findOne({_id:req.params.widget_id},function(err,f){
                  if(f)
                  {
                  Item.find({Ukey:f.Unique_Id},function(err,found){
                    if(found)
                    {
                      res.render('widget_update',{
                      errors:{},
                      User:user,
                      Data:f,
                      ad:found,
                      success:{},
                      Widget:{}
                    })
                  }
                  else
                  {
                    res.render('update_widget',{
                      errors:{},
                      User:user,
                      
                      Data:f,
                      ad:"",
                      success:{},
                      Widget:{}
                    })

                  }
              })
                  
            }
            
          }); 

                
        }
      })
  }
  else
  {
    res.redirect('/');
  }
});



app.get('/flowify_widget/:id',function(req,res){
  
    Flowify_Widget.findOne({_id:req.params.id},function(err,found){
      if(found)
      {
        Item.find({Ukey:found.Unique_Id},function(err,item_info){
          if(item_info)
          {
            console.log(item_info)
              res.render('flowify_widget',{
                errors:{},
                Data:found,
                ad:item_info,
                success:{}   
             })
            }
          })
      }
    })
  
});
app.get('/flowify_widget_add/:id',function(req,res){
  
  Flowify_Widget.find({User_Id:req.params.id,Pre_Build:'Ad'},function(err,found){
    if(found)
    {
      console.log(found);
            res.render('flowify_widget_add',{
              errors:{},
              Data:found,
              success:{}   
           })
    }

  })

});
app.get('/view_widget/:id',function(req,res){
  
    Flowify_Widget.findOne({_id:req.params.id},function(err,found){
      if(found)
      {
       
              res.render('view_widget',{
                errors:{},
                Data:found,
                success:{}   
             })
          
      }
    })
  
  
});
app.get('/ad_iframe/:id',function(req,res){
  
  Flowify_User.findOne({_id:req.params.id},function(err,found){
    if(found)
    {
      Flowify_Widget.findOne({User_Id:req.params.id},function(err,widget){
        if(widget)
        {
     
            res.render('ad_iframe',{
              errors:{},
              Data:found,
              widget:widget,

              success:{}   
           })
          }
        })
        
    }
  })


});
app.get('/buyer_register/:id',function(req,res){
  
    Flowify_Widget.findOne({_id:req.params.id},function(err,found){
      if(found)
      {
        
              res.render('buyer_register',{
                errors:{},
                Data:found,
                success:{}   
             })      
       }
     });
});
app.post('/buyer_info',function(req,res){
  
    Flowify_Widget.findOne({_id:req.body.widget_id},function(err,found){
      if(found)
      {
        Item.findOne({_id:req.body.item_id},function(err,item){
          if(item)
          {
       
              res.render('buyer_info',{
                errors:{},
                Data:found,
                ad:item,
                success:{}   
             })
            }
          })
      }
    })
  
});
app.get('/user_borrow/:id',function(req,res){
 
    Flowify_Widget.findOne({_id:req.params.id},function(err,found){
      if(found)
      {
        
              res.render('user_borrow',{
                errors:{},
                Data:found,
                success:{}   
             })
          
      }
    })
 
});
app.post('/user_personal_info',function(req,res){
  var first_info=[];
  first_info.push(req.body.barrow_amount);
  first_info.push(req.body.loan_term);
  console.log(first_info);
    Flowify_Widget.findOne({_id:req.body.id},function(err,found){
      if(found)
      {
        
              res.render('user_personal_info',{
                errors:{},
                Data:found,
                f_info:first_info,
                success:{}   
             })
          
      }
    })
  
});
app.post('/more_user_personal_info',function(req,res){
  var s_info=[];
  s_info.push(req.body.barrow_amount);
  s_info.push(req.body.loan_term);
  s_info.push(req.body.first_name);
  s_info.push(req.body.middle_name);
  s_info.push(req.body.last_name);
  s_info.push(req.body.email);

  
  console.log(s_info);  
  
    Flowify_Widget.findOne({_id:req.body.id},function(err,found){
      if(found)
      {
       
              res.render('more_user_personal_info',{
                errors:{},
                Data:found,
                s_info:s_info,
                success:{}   
             })
          
      }
    })
 
});
app.post('/user_financial_info',function(req,res){
  var s_info=[];
  s_info.push(req.body.barrow_amount);
  s_info.push(req.body.loan_term);
  s_info.push(req.body.first_name);
  s_info.push(req.body.middle_name);
  s_info.push(req.body.last_name);
  s_info.push(req.body.email);
  s_info.push(req.body.dob);
  s_info.push(req.body.gender);
  s_info.push(req.body.address);
  s_info.push(req.body.number);
  
console.log(s_info);

    Flowify_Widget.findOne({_id:req.body.id},function(err,found){
      if(found)
      {
       
              res.render('user_financial_info',{
                errors:{},
                Data:found,
                s_info:s_info,
                success:{}   
             })
          
      }
    })
 
});
app.post('/user_licence',function(req,res){
  var s_info=[];
  s_info.push(req.body.barrow_amount);
  s_info.push(req.body.loan_term);
  s_info.push(req.body.first_name);
  s_info.push(req.body.middle_name);
  s_info.push(req.body.last_name);
  s_info.push(req.body.email);
  s_info.push(req.body.dob);
  s_info.push(req.body.gender);
  s_info.push(req.body.address);
  s_info.push(req.body.number);
  s_info.push(req.body.expenses);
  s_info.push(req.body.total_as);
  s_info.push(req.body.total_laib);
  console.log(s_info);

    Flowify_Widget.findOne({_id:req.body.id},function(err,found){
      if(found)
      {
        
              res.render('user_licence',{
                errors:{},
                Data:found,
               s_info:s_info,
                success:{}   
             })
      }
    })
 
});
app.post('/l_verification',function(req,res){
  var s_info=[];
  s_info.push(req.body.barrow_amount);
  s_info.push(req.body.loan_term);
  s_info.push(req.body.first_name);
  s_info.push(req.body.middle_name);
  s_info.push(req.body.last_name);
  s_info.push(req.body.email);
  s_info.push(req.body.dob);
  s_info.push(req.body.gender);
  s_info.push(req.body.address);
  s_info.push(req.body.number);
  s_info.push(req.body.expenses);
  s_info.push(req.body.total_as);
  s_info.push(req.body.total_laib);
 
  console.log(s_info);

    Flowify_Widget.findOne({_id:req.body.id},function(err,found){
      if(found)
      {
        var finance_user=new Finance();
       finance_user.Borrow_Amount=req.body.barrow_amount;
       finance_user.Loan_Term=req.body.loan_term;
       finance_user.First_Name=req.body.first_name;
       finance_user.Middle_Name=req.body.middle_name;
       finance_user.Last_Name=req.body.last_name;
       finance_user.Email=req.body.email;
       finance_user.dob=req.body.dob;
       finance_user.Gender=req.body.gender;
       finance_user.Address=req.body.address;
       finance_user.Number=req.body.number;
       finance_user.Expenses=req.body.expenses;
       finance_user.Total_As=req.body.total_as;
       finance_user.Total_Laib=req.body.total_laib;

       finance_user.Licence_Type=req.body.l_type
      if(req.body.l_type=="no")
      {
        finance_user.Licence_No="false";
        finance_user.Licence_Version="false";
        finance_user.Licence_E_Date="false";
        finance_user.Licence_Verification="false";
        

        axios.post('https://us-central1-kycify.cloudfunctions.net/spider-licenseApi-checkLisence', {
         fname: req.body.first_name,
         lname: req.body.last_name,
         mname: req.body.middle_name,
         dob: req.body.dob,
         address: req.body.adress,
        })
        .then((response) => {
          console.log(response.data);
          if(response.data.message=="fail")
          {
            var errors=[];
            errors.push("sorry your passport info is not found");
           console.log(errors);
            res.render('l_verification',{
              errors:errors,
              Data:found,
              success:{}   
           })
          }
          else
          {
            finance_user.Passport_Verification="true";
            finance_user.save(function(err) {    
            })
            var success=[];
            success.push("Your passport is successfully verified we will contct with you after further verification process")
            console.log(success)
            res.render('l_verification',{
              errors:{},
              Data:found,
              success:success   
           })
          }
          
        }, (error) => {
          console.log(error);
        })




      }
      else if(req.body.l_type=="learn")
      {
        finance_user.Licence_No="false";
        finance_user.Licence_Version="false";
        finance_user.Licence_E_Date="false";
        finance_user.Passport_Verification="false";
        finance_user.Licence_Verification="false";



        finance_user.save(function(err) {    
        })
        var success=[];
        success.push("Your info is successfully recieved we will contct with you after further verification process")
        console.log(success)
        res.render('l_verification',{
          errors:{},
          Data:found,
          success:success   
       })
      }
      else if(req.body.l_type=="res")
      {
        finance_user.Licence_No="false";
        finance_user.Licence_Version="false";
        finance_user.Licence_E_Date="false";
        finance_user.Passport_Verification="false";
        finance_user.Licence_Verification="false";


        finance_user.save(function(err) {    
        })
        var success=[];
        success.push("Your info is successfully recieved we will contct with you after further verification process")
        console.log(success)
        res.render('l_verification',{
          errors:{},
          Data:found,
          success:success   
       })
      }
      else if(req.body.l_type=="full")
      {
        finance_user.Licence_No=req.body.l_no;
        finance_user.Licence_Version=req.body.l_v;
        finance_user.Licence_E_Date=req.body.e_date;
        finance_user.Passport_Verification="false";
       

            axios.post('https://us-central1-kycify.cloudfunctions.net/spider-licenseApi-checkLisence', {
                      fname: req.body.first_name,
                    lname: req.body.last_name,
                    mname: req.body.middle_name,
                    dob: req.body.dob,
                    financeamount: req.body.barrow_amount,
                    number: req.body.l_no,
                    version:req.body.l_v
                    })
                    .then((response) => {
                      console.log(response.data);
                      if(response.data.message=="fail")
                      {
                        var errors=[];
                        errors.push("sorry your licence number is not found");
                        console.log(errors);
                        res.render('l_verification',{
                          errors:errors,
                          Data:found,
                          success:{}   
                       })
                      }
                      else
                      {
                        finance_user.Licence_Verification="true";
                        finance_user.save(function(err) {    
                        })
                        var success=[];
                        success.push("Your Licence is successfully verified we will contct with you after further verification process")
                        console.log(success)
                        res.render('l_verification',{
                          errors:{},
                          Data:found,
                          success:success   
                       })
                      }
                      
                    }, (error) => {
                      console.log(error);
                    })

        
      }

        
        
              
      }
    })
 
});
app.post('/user_identify',function(req,res){
  var s_info=[];
  s_info.push(req.body.first_name);
  s_info.push(req.body.middle_name);
  s_info.push(req.body.last_name);
  s_info.push(req.body.email);
  console.log(s_info)

    Flowify_Widget.findOne({_id:req.body.id},function(err,found){
      if(found)
      {
        
              res.render('user_identify',{
                errors:{},
                Data:found,
                s_info:s_info,
                success:{}   
             })
      }
    })
    
  
  
});
app.post('/passport_verification',function(req,res){
  

    Flowify_Widget.findOne({_id:req.body.id},function(err,found){
      if(found)
      {
        console.log(req.body);
        var passport_user=new Passport();
         passport_user.First_Name=req.body.first_name;
         passport_user.Middle_Name=req.body.middle_name;
         passport_user.Last_Name=req.body.last_name;
         passport_user.Email=req.body.email;
         passport_user.dob=req.body.dob;
         passport_user.Address=req.body.address;
         passport_user.Passport_Verification="true";
         
         axios.post('https://us-central1-kycify.cloudfunctions.net/spider-licenseApi-checkLisence', {
          fname: req.body.first_name,
         lname: req.body.last_name,
         mname: req.body.middle_name,
         dob: req.body.dob,
         address: req.body.adress,
        })
        .then((response) => {
          console.log(response.data);
          if(response.data.message=="fail")
          {
            var errors=[];
            errors.push("sorry your passport info is not found");
           console.log(errors);
            res.render('passport_c',{
              errors:errors,
              Data:found,
              success:{}   
           })
          }
          else
          {
            
            passport_user.save(function(err) {    
            })
            var success=[];
            success.push("Your passport is successfully verified we will contct with you after further verification process")
            console.log(success)
            res.render('passport_c',{
              errors:{},
              Data:found,
              success:success   
           })
          }
          
        }, (error) => {
          console.log(error);
        })
         
         
         
        
      }
    })
     
});
app.post('/checkout',function(req,res){
  
  var buyer_info=[];
  buyer_info.push(req.body.buyer_name);
  buyer_info.push(req.body.buyer_phone);
  if(req.body.buyer_address)
  {
    buyer_info.push(req.body.buyer_address);
  }
  else
  {
    buyer_info.push(req.body.store_address);
  }
  console.log(buyer_info);
  
  
  Flowify_Widget.findOne({_id:req.body.widget_id},function(err,widget){
    if(widget)
    {
  
          Item.findOne({_id:req.body.item_id},function(err,found){
            if(found)
            {
              var p=found.Price;
              var sfee=((2.9/100)*p)+0.30;
              console.log(sfee.toFixed(2));
              var total=parseFloat(sfee.toFixed(2))+parseFloat(found.Price);
              console.log(total.toFixed(2));
              total=total.toFixed(2);
              sfee=sfee.toFixed(2);
                    res.render('checkout',{
                      errors:{},
                      Data:widget,
                      sfee:sfee,
                      total_p:found.Price,
                      total:total,
                      buyer_info:buyer_info,
                      success:{}   
                  })
            }
          })
        }
      })
          
  
  
  });
app.post('/payment',function(req,res){
  
var buyer_info=[];
buyer_info.push(req.body.buyer_name);
buyer_info.push(req.body.buyer_phone);
if(req.body.buyer_address)
{
  buyer_info.push(req.body.buyer_address);
}
else
{
  buyer_info.push(req.body.store_address);
}
buyer_info.push(req.body.sfee);
buyer_info.push(req.body.total)
console.log(buyer_info);




  Flowify_Widget.findOne({_id:req.body.id},function(err,found){
    if(found)
    {
      
            res.render('payment',{
              errors:{},
              Data:found,
              total_amount:req.body.total_amount,
              buyer_info:buyer_info,
              success:{}   
           })
    }
  })
  


});
app.get('/widget_update/:id',function(req,res){
  if(req.session.user_id)
  {
    Flowify_Widget.findOne({_id:req.params.id},function(err,found){
      if(found)
      {
        Flowify_User.findOne({_id:req.session.user_id},function(err,user){
          if(user)
          {

            Item.find({Ukey:found.Unique_Id},function(err,item){
              if(item)
              {
              res.render('widget_update',{
              errors:{},
              Data:found,
              ad:item,
              User:user,
              success:{}   
           })
          }
        })
         }
      })
               
      }
    })
  }
  else
  {
    res.redirect('/')
  }
});
app.get('/profile_setting',function(req,res){
  if(req.session.user_id)
  {
        Flowify_User.findOne({_id:req.session.user_id},function(err,user){
          if(user)
          {
            res.render('profile_setting',{
              errors:{},
              User:user,
              success:{}   
           })
         }
      })
               
      }
  
  else
  {
    res.redirect('/')
  }
});

app.post('/logo_update',function(req,res){
  check=0;
  logo="";
  if(req.session.user_id)
  {
    
    upload(req,res,function(err) {
      if(err) {
          return res.end("Error uploading file.");
      }
      else
      {
        Flowify_Widget.findOne({_id:req.body.id},function(err,found){
          if(found)
          {
            found.Logo="Files/"+req.session.user_id+'/'+logo;
            found.save(function(err) {
            });
            Flowify_User.findOne({_id:req.session.user_id},function(err,user){
              if(user)
              {
                Item.find({Ukey:found.Unique_Id},function(err,item){
                  if(item)
                  {
                success=[];
                success.push("Widget logo is successully updated")
                res.render('widget_update',{
                  errors:{},
                  Data:found,
                  ad:item,
                  User:user,
                  success:success  
                  })
                }
              })

            }
          })
                  
          }
        })
          
        }
    })
  }
  else
  {
    res.redirect('/')
  }
});
app.post('/profile_update',function(req,res){
  check=0;
  logo="";
  if(req.session.user_id)
  {
    
    upload(req,res,function(err) {
      if(err) {
          return res.end("Error uploading file.");
      }
      else
      {

        Flowify_User.findOne({_id:req.session.user_id},function(err,user){
          if(user)
          {
              user.Picture="Files/"+req.session.user_id+'/'+logo;
              user.save(function(err) {
              }); 
                  success=[];
                  success.push("User Profile Picture is successully updated")
                  res.render('profile_setting',{
                    errors:{},
                    User:user,
                    success:success  
                })
            
                    
            }
          })
        }
    })
  }
  else
  {
    res.redirect('/')
  }
});
app.post('/back_update',function(req,res){
  logo="";
  check=0;
  if(req.session.user_id)
  {
    
    upload(req,res,function(err) {
      if(err) {
          return res.end("Error uploading file.");
      }
      else
      {

          Flowify_Widget.findOne({_id:req.body.id},function(err,found){
            if(found)
            {
              found.Background="Files/"+req.session.user_id+'/'+logo;
              found.save(function(err) {
              });
              Flowify_User.findOne({_id:req.session.user_id},function(err,user){
                if(user)
                {
                  Item.find({Ukey:found.Unique_Id},function(err,item){
                    if(item)
                    {
                  success=[];
                  success.push("Widget Background is successully updated")
                  res.render('widget_update',{
                    errors:{},
                    Data:found,
                    ad:item,
                    User:user,
                    success:success  
                    })
                  }
                })

              }
            })
                    
            }
          })
        }
    })
  }
  else
  {
    res.redirect('/')
  }
});
app.post('/item_update',function(req,res){
  logo="";
  check=0;
  if(req.session.user_id)
  {
    
    upload(req,res,function(err) {
      if(err) {
          return res.end("Error uploading file.");
      }
      else
      {

          Flowify_Widget.findOne({_id:req.body.id},function(err,found){
            if(found)
            {
              found.Item_Pic="Files/"+req.session.user_id+'/'+logo;
              found.save(function(err) {
              });
              Flowify_User.findOne({_id:req.session.user_id},function(err,user){
                if(user)
                {
                  success=[];
                  success.push("Widget item is successully updated")
                  res.render('widget_update',{
                    errors:{},
                    Data:found,
                    User:user,
                    success:success  
                })
              }
            })
                    
            }
          })
        }
    })
  }
  else
  {
    res.redirect('/')
  }
});

app.post('/profile_text_up',function(req,res){
  if(req.session.user_id)
  {
    Flowify_User.findOne({_id:req.session.user_id},function(err,found){
      if(found)
      {
        found.First_Name=req.body.first_name;
        found.Last_Name=req.body.last_name;
        found.Password=req.body.pass;
        found.Country=req.body.country;
        found.save(function(err) {
          success=[];
          success.push("User text fields are successully updated")
          res.render('profile_setting',{
            errors:{},
            User:found,
            success:success
          })
        
        
        
        })
      }
      })
  }
  else
  {
    res.redirect('/');
  }
})
app.post('/widget_update_text_c',function(req,res){
  if(req.session.user_id)
  {
    Flowify_Widget.findOne({_id:req.body.id},function(err,found){
      if(found)
      {
        if(found.Pre_Build=="Ad")
        {
                found.Name=req.body.name;
                
                found.Responsive=req.body.responsive
                
                found.Theme_Light=req.body.theme_light;
                
                found.Width=req.body.width;
                
                found.Height=req.body.height;
                
                found.Nav_Btn_Color=req.body.nav_btn_color;
                
                found.Nav_Btn_Text_Color=req.body.nav_btn_text_color;

                found.Text_Color=req.body.text_color;
                
                found.Btn_Border=req.body.btn_border
                
                found.Start_Btn_Text=req.body.start_btn_text;
                
                found.Confirm_Btn_Text=req.body.confirm_btn_text;

                
                found.save(function(err) {
        
                  if (err>0)
                  {
                  res.end(err);
                  }
                  else
                  {
                    Flowify_Widget.findOne({_id:req.body.id},function(err,f){
                      if(f)
                      {
                        Flowify_User.findOne({_id:req.session.user_id},function(err,user){
                          if(user)
                          {
                            Item.find({Ukey:f.Unique_Id},function(err,item){
                              if(item)
                              {
                            var success=[];
                            success.push("Widget Text Record is successfully Updated");
                            res.render('widget_update',{
                              errors:{},
                              Data:f,
                              ad:item,
                              User:user,
                              success:success  
                              })
                            }
                            })
                          }
                      })
                              
                      }
                    })

                  }
                });
         
          }
          else if(found.Pre_Build=="SignUp")
          {
            found.Name=req.body.name;
                
                found.Responsive=req.body.responsive
                
                found.Theme_Light=req.body.theme_light;
                
                found.Width=req.body.width;
                
                found.Height=req.body.height;
                
                found.Nav_Btn_Color=req.body.nav_btn_color;
                
                found.Nav_Btn_Text_Color=req.body.nav_btn_text_color;

                found.Text_Color=req.body.text_color;
                
                found.Btn_Border=req.body.btn_border
                
                found.Start_Btn_Text=req.body.start_btn_text;
                
                found.Confirm_Btn_Text=req.body.confirm_btn_text;

                 found.Heading=req.body.heading;
          
                 found.Sub_Heading=req.body.sub_heading;
                
                 found.Page2_Heading=req.body.page2_heading;
                
                 found.Page2_Sub_Heading=req.body.page2_sub_heading;
                
                 found.Confirmation_Text=req.body.confirmation_text;
                
                found.save(function(err) {
        
                  if (err>0)
                  {
                  res.end(err);
                  }
                  else
                  {
                    Flowify_Widget.findOne({_id:req.body.id},function(err,f){
                      if(f)
                      {
                        Flowify_User.findOne({_id:req.session.user_id},function(err,user){
                          if(user)
                          {
                            var success=[];
                            success.push("Widget Text Record is successfully Updated");
                            res.render('widget_update',{
                              errors:{},
                              Data:f,
                              ad:"",
                              User:user,
                              success:success  
                          })
                        }
                      })
                              
                      }
                    })

                  }
                });

          }
          else if(found.Pre_Build=="KYC")
          {
            found.Name=req.body.name;
                
                found.Responsive=req.body.responsive
                
                found.Theme_Light=req.body.theme_light;
                
                found.Width=req.body.width;
                
                found.Height=req.body.height;
                
                found.Nav_Btn_Color=req.body.nav_btn_color;
                
                found.Nav_Btn_Text_Color=req.body.nav_btn_text_color;

                found.Text_Color=req.body.text_color;
                
                found.Btn_Border=req.body.btn_border
                
                found.Start_Btn_Text=req.body.start_btn_text;
                
                found.Confirm_Btn_Text=req.body.confirm_btn_text;

                
                found.save(function(err) {
        
                  if (err>0)
                  {
                  res.end(err);
                  }
                  else
                  {
                    Flowify_Widget.findOne({_id:req.body.id},function(err,f){
                      if(f)
                      {
                        Flowify_User.findOne({_id:req.session.user_id},function(err,user){
                          if(user)
                          {
                            var success=[];
                            success.push("Widget Text Record is successfully Updated");
                            res.render('widget_update',{
                              errors:{},
                              Data:f,
                              ad:"",
                              User:user,
                              success:success  
                          })
                        }
                      })
                              
                      }
                    })

                  }
                });


          }
          else if(found.Pre_Build=="Finance")
          {
            found.Name=req.body.name;
                
                found.Responsive=req.body.responsive
                
                found.Theme_Light=req.body.theme_light;
                
                found.Width=req.body.width;
                
                found.Height=req.body.height;
                
                found.Nav_Btn_Color=req.body.nav_btn_color;
                
                found.Nav_Btn_Text_Color=req.body.nav_btn_text_color;

                found.Text_Color=req.body.text_color;
                
                found.Btn_Border=req.body.btn_border
                
                found.Start_Btn_Text=req.body.start_btn_text;
                
                found.Confirm_Btn_Text=req.body.confirm_btn_text;

                 found.Heading=req.body.heading;
          
                 found.Sub_Heading=req.body.sub_heading;
                
                 found.Page2_Heading=req.body.page2_heading;
                
                 found.Page2_Sub_Heading=req.body.page2_sub_heading;
                
                 found.Confirmation_Text=req.body.confirmation_text;
                
                found.save(function(err) {
        
                  if (err>0)
                  {
                  res.end(err);
                  }
                  else
                  {
                    Flowify_Widget.findOne({_id:req.body.id},function(err,f){
                      if(f)
                      {
                        Flowify_User.findOne({_id:req.session.user_id},function(err,user){
                          if(user)
                          {
                            var success=[];
                            success.push("Widget Text Record is successfully Updated");
                            res.render('widget_update',{
                              errors:{},
                              Data:f,
                              ad:"",
                              User:user,
                              success:success  
                          })
                        }
                      })
                              
                      }
                    })

                  }
                });


          }








               
      }

    })
  }
  else
  {
    res.redirect('/')
  }
});

    

    app.get('/logout',(req,res) => {
      if(req.session.user_id)
      {
        req.session.destroy((err) => {
          if(err) {
              return console.log(err);
          }
          res.redirect('/');
      });
      }
      else
      {
        req.session.destroy((err) => {
          if(err) {
              return console.log(err);
          }
          res.redirect('/');
      });
      }
    
    });

    app.post('/user_login_c',function(req,res){
	
      var errors=[];
      if(!req.body.email)
      {
        errors.push("Plz Enter Emial");
      }
      if(!req.body.pass)
      {
        errors.push("Plz Enter Passoword");
      }	
      if(errors.length>0)
      {
        res.render('index',{
          errors:errors,
          success:{}
        })
      }
      else
      {
        Flowify_User.findOne({Email: req.body.email},function(err,found){
          if(found)
          {
            console.log(req.body)
            if((found.Email==req.body.email) && (found.Password==req.body.pass))
            {
            
              req.session.user_id=found._id;
              res.redirect('/user-dash-board');
            }
            else
            {
              var errors=[];
              errors.push("Email Address/Passowrd is wrong!");
              res.render('index',{
                errors:errors,
                success:{}
                
              });
            }
    
          }
          else
          {
            var errors=[];
            errors.push("Email Address/Passowrd is wrong!");
            res.render('index',{
              errors:errors,
              success:{}
            });	
          }
        });
        
      }
      
      
    })
    app.get('/delete_widget/:id',function(req,res,next){
      if(req.session.user_id)
      {
        Flowify_Widget.find({_id: req.params.id}).remove()
								.exec(function(err,foundpin){
										
									res.redirect('/user-dash-board');
								})
      }
      else
      {
        res.redirect('/');
      }
    });




app.listen(80,function(){
	console.log("Server started on Port 80");
})


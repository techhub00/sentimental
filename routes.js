const express =require('express');
const router = express.Router();

router.get('/insert',function(req,res){
	res.render('insert',{
		errors:{},
		success:{}
	})
})
router.post('/register_c',function(req,res){
	var errors=[];
	if(!req.body.carid)
	{
		errors.push("Plz Ener Car ID");
	}
	if(!req.body.carcolor)
	{
		errors.push("Plz Choose car color");
	}
	if(!req.body.carcompany)
	{
		errors.push("Plz choose car company");
	}
	if(!req.body.carmodel)
	{
		errors.push("Plz choose car Model");
	}
	if(!req.body.carowner)
	{
		errors.push("Plz Ener car owner");
	}
	if(errors.length>0)
	{
		res.render('insert',{
			errors:errors,
			success:{}
		})
	}
	else
	{
		

	}
})

router.get('/search',function(req,res){
	res.render('search',{
		errors:{}
	})
})
router.post('/search_c',function(req,res){
	var errors=[];
	if(!req.body.carid)
	{
		errors.push("Plz Ener Car ID");
	}
	if(errors.length>0)
	{
		res.render('search',{
			errors:errors
			
		})
	}
	else
	{
		
	}
})

router.get('/update',function(req,res){
	res.render('update',{
		errors:{},
		success:{}
	})
})
router.post('/update_C',function(req,res){
	var errors=[];
	if(!req.body.carid)
	{
		errors.push("Plz Ener Car ID");
	}
	if(!req.body.ncarowner)
	{
		errors.push("Plz Ener new car owner");
	}
	if(errors.length>0)
	{
		res.render('update',{
			errors:errors,
			success:{}
			
		})
	}
	else
	{
		
	}	
})






module.exports=router
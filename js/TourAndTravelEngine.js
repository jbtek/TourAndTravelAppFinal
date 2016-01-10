var app = angular.module("TourAndTravelEngineModule",['ngRoute','720kb.datepicker']);
app.factory("DataServicesFactory",function($http){
	return {
		get:function(url){
			return $http.get(url).then(function(result){
				return result.data;
			})
		}
	}
})
.controller("TourAndTravelController",function($scope,DataServicesFactory,$rootScope,splitFilter){
	DataServicesFactory.get("assets/data/tourtraveldata.txt").then(function(data){
		$scope.items = data.cities.city.split(",");
		$scope.dataJson = data;
	});
	$scope.cityname = {to:"",from:""};
	$scope.dates = {to:"",from:"",returnd:""};
	$scope.views = {searchform:true,busdetails:false};
	$scope.strSChange = "HELLO EVERY ONE"
	
	$scope.handleSearches = function(){
		$scope.views = {searchform:false,busdetails:true};
		$scope.updateSrcDestDate()
	}
	
	$scope.updateSrcDestDate = function(){
		var elemSrcDest = angular.element(document.querySelector(".srcdest"));
		var elemDate = angular.element(document.querySelector(".date-display"));
		elemSrcDest.text($scope.cityname.from+" To "+$scope.cityname.to);
		elemDate.text($scope.dates.from);
	}
	
})  
.directive('autoFocus', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element[0].focus();
    }
  };
})
.filter('split', function() {
  return function(input, delimiter) {
    delimiter = delimiter || ','
    return input.split(delimiter);
  }
})
.directive("headerBus",function($timeout,$window){
	var busHeaderLinker = function(scope,elem,attr){
			
	}
	
	return{
		restrict:"AEC",
		templateUrl:"templates/header.html",
		link:busHeaderLinker
	}
})
.directive("busSearch",function($timeout,$window){
	var busSearchLinker = function(scope,elem,attr){
		var isClicked = false
		scope.$watch('citynames',function(n){
			if(n)
			scope.dummyItems = n.cities.city.split(",");
		})
		scope.defualtModel ={to:"",from:""}
		scope.selected = {to:true,from:true};
		scope.isSearchBtnClicked = false;
		var date = new Date();
		scope.currentDateFrom = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
		alert("::::::"+scope.currentDate);
		scope.$watch('dateMinLimit',function(value){
			alert("from::::"+value)
			scope.currentDateTo = value;
		})

		scope.current = 0;
		var inputf;
		angular.element($window).bind('click focus', function onClickOnWindow() {
			if(inputf && !isClicked)
			{	
				inputf.next().removeClass("_720kb-datepicker-open");
				isClicked = true
			}
        });
		
		scope.isCurrent = function(index,defaultItem,type){
			if(index==0)
			{
				if(type==="from")
				scope.defualtModel.from = defaultItem;
				else if(type==="to")
				scope.defualtModel.to = defaultItem;
				return true
			}
			else
			return scope.current==index;
		}
		scope.setCurrent = function(index){scope.current = index;}
		scope.handleClick = function(selectedItem,type){
			console.log("handleClick");
			isClicked = true;
			updateModel(selectedItem,type)
			setFocus(1)
		}
		
		scope.handleBlur = function(type){
			console.log("Bluring")
			
			if(!isClicked)
			{
				if(type==="from")
				updateModel(scope.defualtModel.from,type);
				else if(type==="to")
				updateModel(scope.defualtModel.to,type);
			}
		}
		
		scope.handleKeyPress = function(type){
			isClicked = false
			var unbinderFrom = scope.$watch('model.from',function(n){
				if(n=='')
				{
					scope.selected = {to:true,from:true};
					scope.items = scope.dummyItems
					return;
				}
				else
				{
					if(type=="from"){
					scope.selected = {to:true,from:false};
					scope.items = applyFilter(n);
					$timeout(function(){
						unbinderFrom();
					 },5);
					}
				}
			});
			
			var unbinderTo = scope.$watch('model.to',function(n){
				if(n=='')
				{
					scope.selected = {to:true,from:true};
					scope.items = scope.dummyItems
					return;
				}
				else
				{
					if(type=="to"){
					scope.selected = {to:false,from:true};
					scope.items = applyFilter(n);
					$timeout(function(){
						unbinderTo();
					  },5);
					}
				}
			});
		}
		scope.handleBusSearches = function(evt){
			isClicked = true;
			scope.isSearchBtnClicked = true;
			
			if(scope.model.from!="" && scope.model.to!="")
			{
				console.log("inputf::"+scope.dates.from);
				if(scope.dates.from==""){
					var elCalander = $window.document.querySelector(".datepicker");
					inputf = angular.element(elCalander).find("input");
					inputf.next().addClass("_720kb-datepicker-open");
				}
				else
				{
					scope.$parent.handleSearches();
				}
			}
			$timeout(function(){
				isClicked = false;
			},300);
			
		}
		function applyFilter(char){
			var filtered = []
			/*angular.forEach(scope.dummyItems, function(item) {
				  if(char.toLowerCase()==String(item).substring(0,char.length).toLowerCase()) {
					filtered.push(item);
				  }
				});*/
			filtered = scope.dummyItems.map(function(item){
					var arr = []
					if(String(item).substring(0,char.length).toLowerCase()===char.toLowerCase())
					{
						return item
					}
				}).filter(function(item){
					return item != undefined
				});
			//console.log("abbr::"+filtered);
			return filtered;
		}
		
		function updateModel(selectedItem,type){
			//console.log(scope.model.from+"updateModel"+selectedItem)
			$timeout(function(){
			scope.selected = {
				to:true,
				from:true
			}
			},10);
			scope.current = 0;
			if(type==="from")
			{
					if(scope.model.from!="" && selectedItem!="")
					scope.model.from = selectedItem;
					return;
			}
			else if(type==="to")
			{
					if(scope.model.to!="" && selectedItem!="")
					scope.model.to = selectedItem;
					return;
			}
			isClicked = false;
			
			
		}
		
		function setFocus(index){
			$timeout(function(){
				var elemList = elem.children().children().children().children();
				var input = angular.element(elemList[0]).find("input")[index];
				input.focus();
			},10);
		}
	}
	
	return {
		restrict:"AEC",
		scope:{
			model:'=',
			citynames:'=',
			items:'=',
			dates:'='
			
		},
		templateUrl:"templates/bussearchform.html",
		link:busSearchLinker
	}
}).
directive("busDetails",function($timeout,$window){
	var busDetailsLinker = function(scope,elem,attr){
		
		var btnTxt = "View Status";
		var inputf;
		var isClicked = false;
		scope.handleViewStatus  = function(index,evt){
			var allTR = angular.element(document.querySelector(".last-tr"));
			btnTxt = angular.element(evt.currentTarget).text();
			//console.log("btnTxt::::"+btnTxt);
			var trContent;
			if(btnTxt=="View Status")
			{
				var htmlTxtTr = allTR.html();
				angular.element(evt.currentTarget).parent().parent().after('<tr class="trconent">'+htmlTxtTr+'</tr>');
				angular.element(evt.currentTarget).text("Hide Status");
				trContent = angular.element(evt.currentTarget).parent().parent().next().find("div");
				trContent.addClass("slideup");
				$timeout(function(){
					if (trContent.hasClass("slideup"))
					trContent.removeClass("slideup").addClass("slidedown");
					else
					trContent.removeClass("slidedown").addClass("slideup");
				},0);
			}
			else
			{
				trContent = angular.element(evt.currentTarget).parent().parent().next().find("div");
				
				if (trContent.hasClass("slidedown"))
				trContent.removeClass("slidedown").addClass("slideup");
				else
				trContent.removeClass("slideup").addClass("slidedown");
				
				angular.element(evt.currentTarget).text("View Status");
				$timeout(function(){
					trContent.parent().parent().remove();
				},500);
			}
		}
		
		angular.element($window).bind('click focus', function onClickOnWindow() {
			if(inputf && !isClicked)
			{
				console.log("click:::");
				inputf.next().removeClass("_720kb-datepicker-open");
				
			}
        });
		
		scope.openCalander = function(){
			isClicked = true;
			var elCalander = $window.document.querySelector(".datepicker");
			console.log("elCalander:::"+elCalander);
			inputf = angular.element(elCalander).find("input");
			inputf.next().addClass("_720kb-datepicker-open");
			$timeout(function(){
				isClicked = false;
			},300);
		}
	}
	
	return{
		restrict:"AEC",
		templateUrl:"templates/busdetailslist.html",
		link:busDetailsLinker
	}
});
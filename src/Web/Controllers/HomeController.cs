using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

namespace Web.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        #region Properties and variables

        private IConfigurationRoot Config;
        private string _apiBaseUrl;
        private string ApiBaseUrl
        {
            get
            {
                if (_apiBaseUrl == null)
                {
                    _apiBaseUrl = Config["API:Url"] + "/" + Config["API:Env"] + "/" + Config["API:ClientKey"] + "/" + Config["API:Version"] + "/" + Config["API:ApplicationId"]+"/Order/";
                }
                return _apiBaseUrl;
            }
        }
        private int UserId
        {
            get {
                var claims = HttpContext?.User?.Claims;

                if (claims != null && claims.Count() > 0) //logged in
                {
                    var id = claims.FirstOrDefault(x => x.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
                    if(id!=null)
                    {
                        return int.Parse(id.Value);
                    }
                }

                return 0;
            }
        }

        #endregion

        #region Constructor
        /// <summary>
        /// Constructor, Configuration info injectd here
        /// </summary>
        /// <param name="config"></param>
        public HomeController(IConfigurationRoot config)
        {
            this.Config = config;
        }

        #endregion

        #region Products

        /// <summary>
        /// Products/Home page entry
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Index()
        {
            ViewBag.LoggedIn = UserId > 0 ? "1" : "0";
            return View();
        }

        /// <summary>
        /// Porudcts/home page view template
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult HomeTemplate()
        {
            // The 3rd party API url address is passed to client side
            ViewBag.ApiBaseUrl = ApiBaseUrl;
            return PartialView();
        }

        /// <summary>
        /// Get product list
        /// </summary>
        /// <param name="filter"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ProductList(string filter, int page, int pageSize)
        {
            var result =await Data.Repository.GetProducts(filter, page, pageSize);
            //convert the mocked data 
            return Json(result.Select(x=>new {id=x.Id, name = x.Name, description = x.Description, imageUrl=Url.Content("~/images/"+x.ImageUrl), unitPrice = x.UnitPrice }).ToList());
        }

        /// <summary>
        /// Add product to a basket
        /// If basket id missing, that mean this is a new basket, then create a new one and return the id
        /// </summary>
        /// <param name="basketId">GUID, basket id</param>
        /// <param name="productId">int, Product Id</param>
        /// <param name="quantity">int, quantity of product to add</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> AddToBasket(int productId, int quantity)
        {
            try
            {
                var info = await Data.Repository.AddToBasket(UserId, productId, quantity);
                return Json(new { count=info.ItemsCount, total = info.TotalAmount});
            }
            catch (Exception ex)
            {
                return Json(new { msg = ex.Message});
            }
        }

        /// <summary>
        /// Get basket summary info
        /// </summary>
        /// <param name="basketId"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetBasketInfo(Guid basketId)
        {
            var info = await Data.Repository.GetBasketInfo(UserId);
            return Json(new { count = info.ItemsCount, total = info.TotalAmount});
        }

        #endregion

        #region My Basket

        /// <summary>
        /// My basket page entry view
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> Basket()
        {
            return View();
        }
       
        /// <summary>
        /// Basket view template
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> BasketTemplate()
        {
            return PartialView();
        }

        /// <summary>
        /// Get product list of basket
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetBasketProducts()
        {
            var list =await Data.Repository.GetBasketProducts(UserId);
            return Json(list.Select(x=>new {id = x.Key.Id, name = x.Key.Name, imageUrl =Url.Content("~/images/"+ x.Key.ImageUrl), unitPrice=x.Key.UnitPrice, quantity=x.Value,total=x.Value*x.Key.UnitPrice  })
                .ToList());
        }

        /// <summary>
        /// Update product quantity for the item in basket
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> UpdateQuantity( int productId, int quantity)
        {
            await Data.Repository.UpdateBasket(UserId, productId, quantity);
            return Json(new { });
        }

        /// <summary>
        /// Remove a product from basket
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> RemoveProduct(int productId)
        {
            await Data.Repository.RemoveFromBasket(UserId, productId);
            return Json(new { });
        }

        /// <summary>
        /// Place an order aginst the given product
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> PlaceOrder(int productId)
        {
            await Data.Repository.PlaceOrder(UserId, productId);
            return Json(new { });
        }

        /// <summary>
        /// Place an order against all items in basket
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> PlaceAllOrder()
        {
            await Data.Repository.PlaceAllOrder(this.UserId);
            return Json(new { });
        }

        #endregion

        #region Orders

        /// <summary>
        /// Order entry page
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> Orders()
        {
            return View();
        }

        /// <summary>
        /// Order view template
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> OrdersTemplate()
        {
            return PartialView();
        }

        /// <summary>
        /// Get placed orders
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetOrders(int page, int pageSize)
        {
            var orders = await Data.Repository.GetOrders(UserId, page, pageSize);

            var list = orders.Select(x => new
            {
                id = x.Id,
                time = string.Format("{0:dd MMM yyyy HH:mm}", x.Time),
                orderNo = string.Format("{0:yyyyMMdd}-{1}",x.Time,x.Id),
                products = x.Products.Select(p => new { item = Data.Repository.GetProductSync(p.Key), quantity = p.Value }).ToList(),
                quantity = x.Products.Sum(p => p.Value),
                total = x.Products.Sum(p=>p.Value * Data.Repository.GetProductSync(p.Key).UnitPrice)
            })
                .ToList();

            return Json(list);
        }

        #endregion

        [AllowAnonymous]
        public IActionResult Error()
        {
            return View();
        }
    }

}

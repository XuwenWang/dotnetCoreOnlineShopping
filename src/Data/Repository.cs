using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Data
{
    public class Repository
    {
        private static List<Product> _products = null;
        public static List<Product> Products
        {
            get
            {
                if (_products == null)
                {
                    _products = new List<Product>();
                    for (var i = 1; i <= 300; i++)
                    {
                        _products.Add(
                            new Product
                            {
                                Id = i,
                                Description = $"Product {i} description " + Environment.NewLine + @"Lorem ipsum dolor sit amet, eam docendi facilisi assentior ne, in tincidunt definiebas qui, per eu feugiat legimus omnesque. Cu pri dicit labore dignissim. Ut ipsum scaevola pri. Ad dolore aperiam vocibus mel, usu an populo dissentias, viris soluta libris vis ut.",
                                Details = @"Lorem ipsum dolor sit amet, eam docendi facilisi assentior ne, in tincidunt definiebas qui, per eu feugiat legimus omnesque. Cu pri dicit labore dignissim. Ut ipsum scaevola pri. Ad dolore aperiam vocibus mel, usu an populo dissentias, viris soluta libris vis ut.
Mei id natum munere labore. Et modus graeci consetetur his, at vis tincidunt scripserit, nec ne aliquip vocibus. Usu unum temporibus at, ut mel sint inciderint concludaturque, elitr saperet no vis. Vix quem viris ei, in qui dicit delectus urbanitas.
No tantas mentitum vim, usu nominavi periculis cu. Tempor inciderint vis ei, aeque maiorum assentior vel ea, possim volumus scriptorem in mei. At eos wisi argumentum. No labore facilisis eam, qui diceret philosophia ex, posidonium definitiones nam id. Ius porro atqui eu, tollit temporibus definitiones te has, dicat molestiae splendide an eum. Movet nemore vivendo in nam, mea corpora recusabo cu, an clita admodum liberavisse quo.
Nihil vitae dolorum cum ut, no dicat salutandi sea, sed iisque apeirian conceptam ad. Ut nibh delectus sit, dolor probatus ne vim. Eam at ancillae atomorum forensibus. Graeco maiorum ad pro. Cu ullum reprehendunt vis, mel posse equidem philosophia cu. Falli corpora deterruisset no est, ne pri impetus virtute urbanitas, an per accusam imperdiet mediocritatem.",
                                Name = $"Product {i}",
                                ImageUrl = "product.png",
                                UnitPrice = 10 * i
                            });
                    }
                }
                return _products;
            }
        }
        public static List<Basket> Baskets = new List<Basket>() { new Basket() { UserId=1 } };
        public static List<Order> Orders = new List<Order>();
        public static List<User> Users = new List<User>() { new User { Id = 1, Email = "test@test.com", Name = "Alex", Password = "123456"  } };


        #region Mock services

        /// <summary>
        /// register new user
        /// </summary>
        /// <param name="email"></param>
        /// <param name="name"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async static Task AddNewUser(string email, string name, string password)
        {
            if (Users.Any(x => string.Equals(email, x.Email, StringComparison.CurrentCultureIgnoreCase)))
            {
                throw new Exception("Email already in use.");
            }

            var user = new User() { Id = Users.Count() + 1, Email = email, Name = name, Password = password };

            Users.Add(user);
            Baskets.Add(new Basket() { UserId = user.Id });
        }

        /// <summary>
        /// Validate user by email and password
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns>valid user object</returns>
        public async static Task<User> ValidateUser(string email, string password)
        {
            var user = Users.FirstOrDefault(x => string.Compare(x.Email.Trim(), email.Trim(), true) == 0);
            if (user == null)
            {
                throw new Exception("User does not exist.");
            }
            if (user.Password != password)
            {
                throw new Exception("Invalid password.");
            }

            return user;
        }

        /// <summary>
        /// Get product, filtered by name
        /// </summary>
        /// <param name="filter">string, name filter</param>
        /// <param name="page">integer, page</param>
        /// <param name="pageSize">integer, page size</param>
        /// <returns>List of products</returns>
        public async static Task<List<Product>> GetProducts(string filter, int page, int pageSize)
        {
            return Products.Where(x => string.IsNullOrWhiteSpace(filter) || x.Name.ToUpper().Contains(filter.Trim().ToUpper()))
                .OrderBy(x => x.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }

        /// <summary>
        /// get basket summary: items count, total amount
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async static Task<BasketInfo> GetBasketInfo(int userId)
        {
            var info = new BasketInfo();

            var basket = Baskets.FirstOrDefault(x => x.UserId == userId);
            if (basket != null && basket.Products != null)
            {
                foreach (var kv in basket.Products)
                {
                    var unitPrice = (from p in Products
                                     where p.Id == kv.Key
                                     select p.UnitPrice)
                                 .FirstOrDefault();
                    info.ItemsCount += kv.Value;
                    info.TotalAmount += unitPrice * kv.Value; /*quantity*/
                }
            }
            return info;
        }

        /// <summary>
        /// Add product to basket
        /// </summary>
        /// <param name="userId">guid, basket id</param>
        /// <param name="productId">int, product id</param>
        /// <param name="quantity">int, product quantity to add</param>
        /// <returns>summary info of basket</returns>
        public async static Task<BasketInfo> AddToBasket(int userId, int productId, int quantity)
        {
            var basket = Baskets.FirstOrDefault(x => x.UserId == userId);
            //if basket doesn't exist, create a new one
            if (basket == null)
            {
                basket = new Basket() { UserId = userId };
                Baskets.Add(basket);
            }

            if (basket.Products == null)
            {
                basket.Products = new Dictionary<int, int>();
            }
            if (basket.Products.ContainsKey(productId))
            {
                basket.Products[productId] += 1;
            }
            else
            {
                basket.Products.Add(productId, quantity);
            }

            return await GetBasketInfo(userId);
        }


        /// <summary>
        /// Update quantity of product in basket
        /// </summary>
        /// <param name="id"></param>
        /// <param name="productId"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        public async static Task UpdateBasket(int userId, int productId, int quantity)
        {
            var basket = Baskets.FirstOrDefault(x => x.UserId == userId);
            if (basket != null)
            {
                if (basket.Products != null && basket.Products.ContainsKey(productId))
                {
                    basket.Products[productId] = quantity;
                }
            }
        }

        /// <summary>
        /// Remove product from basket
        /// </summary>
        /// <param name="id"></param>
        /// <param name="productId"></param>
        /// <returns></returns>
        public async static Task RemoveFromBasket(int userId, int productId)
        {
            var basket = Baskets.FirstOrDefault(x => x.UserId == userId);
            if (basket != null)
            {
                if (basket.Products != null && basket.Products.ContainsKey(productId))
                {
                    basket.Products.Remove(productId);
                }
            }
        }

        /// <summary>
        /// get product list of a given basket
        /// </summary>
        /// <param name="id">basket id</param>
        /// <returns></returns>
        public async static Task<Dictionary<Product, int>> GetBasketProducts(int userId)
        {
            var result =new Dictionary<Product, int>();

            var basket = Baskets.FirstOrDefault(x => x.UserId == userId);
            if(basket!=null && basket.Products!=null)
            {
                foreach(var kv in basket.Products.OrderBy(x=>Products.First(p=>p.Id ==x.Key).Name ))
                {
                    var product = Products.FirstOrDefault(x => x.Id == kv.Key);
                    if(product!=null && kv.Value>0)
                    {
                        result.Add(product, kv.Value);
                    }
                }
            }

            return result;
        }

        /// <summary>
        /// Place order for one product
        /// </summary>
        /// <param name="basketId"></param>
        /// <param name="productId"></param>
        /// <returns></returns>
        public async static Task PlaceOrder(int userId, int productId)
        {
            var basket = Baskets.FirstOrDefault(x => x.UserId == userId);
            if(basket==null)
            {
                throw new Exception("Basket not found");
            }
            var quantity = basket.Products[productId];
            
            var order = new Order()
                {
                    UserId = userId,
                    Products =new Dictionary<int, int>() {  { productId, quantity } },
                    Time=DateTime.Now,
                    Id = Orders.Count()+1
                };

            Orders.Add(order);

            //remove from basket
            basket.Products.Remove(productId);
        }

        /// <summary>
        /// Place orders for all products in basket
        /// </summary>
        /// <param name="basketId"></param>
        /// <returns></returns>
        public async static Task PlaceAllOrder(int userId)
        {
            var basket = Baskets.FirstOrDefault(x => x.UserId == userId);
            if (basket == null)
            {
                throw new Exception("Basket not found");
            }
            if(basket.Products==null || basket.Products.Count==0)
            {
                throw new Exception("No products.");
            }

            var order = new Order() { UserId = userId, Time=DateTime.Now, Id = Orders.Count()+1, Products =new Dictionary<int, int>() };
            foreach(var kv in basket.Products)
            {
                var productId = kv.Key;
                var quantity = kv.Value;
                order.Products.Add(productId, quantity);
                
            }
            Orders.Add(order);
            
            //clear the basket
            basket.Products = new Dictionary<int, int>();
            
        }

        /// <summary>
        /// Get orders by user
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public async static Task<List<Order>> GetOrders(int userId, int page, int pageSize)
        {
            var list = new List<Order>();

            return Orders.Where(x => x.UserId == userId)
                .OrderByDescending(x => x.Time)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }

        /// <summary>
        /// Get product by give product id
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public async static Task<Product> GetProduct(int productId)
        {
            return Products.FirstOrDefault(x => x.Id == productId);
        }

        /// <summary>
        /// Get product by give product id
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public static Product GetProductSync(int productId)
        {
            return Products.FirstOrDefault(x => x.Id == productId);
        }

        #endregion
    }
}

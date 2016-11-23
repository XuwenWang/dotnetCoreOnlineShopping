using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Web;
using Web.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;

namespace UnitTest
{
    [TestClass]
    public class Tests
    {
        public IConfigurationRoot mockConfig;

        [TestInitialize]
        public void Setup()
        {
            mockConfig = new MockConfig() { Values = new Dictionary<string, string>() {
                { "API:Url","http://api" }, { "API:Env","Test"}, { "API:ClientKey","key"}, { "API:Version", "v2" } } } ;

        }

        [TestCategory("Web")]
        [TestMethod]
        public void TestLoginPage()
        {
            // Arrange
            var controller = new AccountController(mockConfig);
            // Act
            var result = controller.Login() as IActionResult;

            // Assert
            Assert.IsNotNull(result);

        }

        [TestCategory("Web")]
        [TestMethod]
        public async Task TestRegisterPage()
        {
            // Arrange
            var controller = new AccountController(mockConfig);
            // Act
            var result = await controller.Register() as IActionResult;

            // Assert
            Assert.IsNotNull(result);

        }

        [TestCategory("Web")]
        [TestMethod]
        public void TestHomePage()
        {
            // Arrange
            var controller = new HomeController(mockConfig);
            // Act
            var result = controller.Index() as IActionResult;

            // Assert
            Assert.IsNotNull(result);

        }

        [TestCategory("Web")]
        [TestMethod]
        public async Task TestMyBasketPage()
        {
            // Arrange
            var controller = new HomeController(mockConfig);
            // Act
            var result = await controller.Basket() as IActionResult;

            // Assert
            Assert.IsNotNull(result);

        }

        [TestCategory("Web")]
        [TestMethod]
        public async Task TestMyOrdersPage()
        {
            // Arrange
            var controller = new HomeController(mockConfig);
            // Act
            var result = await controller.Orders() as IActionResult;

            // Assert
            Assert.IsNotNull(result);

        }


        [TestCategory("Data")]
        [TestMethod]
        public async Task TestGetProducts()
        {
            var list =await Data.Repository.GetProducts(null, 1, 10);
            Assert.IsTrue(list != null && list.Count == 10);
        }


        [TestCategory("Data")]
        [TestMethod]
        public async Task TestGetProductById()
        {
            var product = await Data.Repository.GetProduct(1);
            Assert.IsNotNull(product);
            Assert.IsTrue(product.Id == 1);
        }


        [TestCategory("Data")]
        [TestMethod]
        public async Task TestValiateUser()
        {
            var user = await Data.Repository.ValidateUser("test@test.com", "123456");
            Assert.IsNotNull(user);
            Assert.IsTrue(user.Email == "test@test.com");
        }


        [TestCategory("Data")]
        [TestMethod]
        public async Task TestAddToBasket()
        {
            var info = await Data.Repository.AddToBasket(1, 1, 1);
            Assert.IsNotNull(info);
            Assert.IsTrue(info.ItemsCount>0);
        }

        [TestCategory("Data")]
        [TestMethod]
        public async Task TestGetOrders()
        {
            var orders = await Data.Repository.GetOrders(1, 1, 10);
            Assert.IsNotNull(orders);
            Assert.IsTrue(orders.Count==0);
        }



    }

    public class MockConfig : IConfigurationRoot
    {

        public Dictionary<string, string> Values { get; set; }

        public string this[string key]
        {
            get
            {
                return Values[key];
            }

            set
            {
                if (Values.ContainsKey(key))
                    Values[key] = value;
                else
                    Values.Add(key, value);
            }
        }

        public IEnumerable<IConfigurationSection> GetChildren()
        {
            throw new NotImplementedException();
        }

        public IChangeToken GetReloadToken()
        {
            throw new NotImplementedException();
        }

        public IConfigurationSection GetSection(string key)
        {
            throw new NotImplementedException();
        }

        public void Reload()
        {
            throw new NotImplementedException();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Data
{
    public class Product
    {
        public int Id { get; set;}
        public string Name { get; set; }
        public string Description { get; set; }
        public string Details { get; set; }
        public string ImageUrl { get; set; }
        public decimal UnitPrice { get; set; }
    }
}

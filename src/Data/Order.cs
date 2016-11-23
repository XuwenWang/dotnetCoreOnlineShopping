using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Data
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        //product id, quantity
        public Dictionary<int, int> Products {get;set;}
        public DateTime Time { get; set; }
    }
}

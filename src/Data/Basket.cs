using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Data
{
    public class Basket
    {
        public int UserId { get; set; }
        //<product Id, quantity>
        public Dictionary<int, int> Products { get; set; }
    }
}

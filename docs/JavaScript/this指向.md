## 事件绑定
不论DOM0还是DOM2级事件绑定,给元素el的某个时间绑定行为,当事件触发时,方法中的this指向元素el
(特殊情况: IE6-IE8中,基于attachEvent绑定的事件,this指向window,call/apply/bind强制改变了函数中的this的指向)
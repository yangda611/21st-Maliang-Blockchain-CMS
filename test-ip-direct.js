// 直接测试IP检测逻辑 - 使用内置fetch
async function testIPDetection() {
  try {
    // 测试日本IP
    console.log('Testing Japan IP: 210.140.92.183');
    const response = await fetch('http://ip-api.com/json/210.140.92.183?fields=status,countryCode');
    const data = await response.json();
    console.log('API Response:', data);
    
    // 测试美国IP
    console.log('\nTesting US IP: 8.8.8.8');
    const response2 = await fetch('http://ip-api.com/json/8.8.8.8?fields=status,countryCode');
    const data2 = await response2.json();
    console.log('API Response:', data2);
    
    // 测试中国IP
    console.log('\nTesting China IP: 114.114.114.114');
    const response3 = await fetch('http://ip-api.com/json/114.114.114.114?fields=status,countryCode');
    const data3 = await response3.json();
    console.log('API Response:', data3);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testIPDetection();

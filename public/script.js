document.addEventListener('DOMContentLoaded', function() {
    const questionInput = document.getElementById('questionInput');
    const userInfoInput = document.getElementById('userInfoInput');
    const submitBtn = document.getElementById('submitBtn');
    const resultText = document.getElementById('resultText');

    submitBtn.addEventListener('click', async function() {
        const userInput = questionInput.value.trim();
        const remark = userInfoInput.value.trim();

        if (!userInput || !remark) {
            alert('请填写完整信息');
            return;
        }

        // 显示加载状态
        submitBtn.disabled = true;
        submitBtn.textContent = '求签中...';

        try {
            const response = await fetch('/api/fortune', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_input: userInput,
                    remark: remark
                })
            });

            const result = await response.json();
            
            if (result.code === 0) {
                // 解析返回的 data 字符串为 JSON 对象
                const fortuneData = JSON.parse(result.data);
                // 获取签文内容并处理换行符
                const content = fortuneData.data.replace(/\\n/g, '<br>');
                
                // 显示结果
                resultText.innerHTML = content;
                resultText.style.display = 'block';
            } else {
                alert('获取结果失败: ' + result.msg);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('请求失败，请重试');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '求签';
        }
    });
}); 
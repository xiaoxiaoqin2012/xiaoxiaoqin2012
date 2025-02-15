const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // 用于托管静态文件

// API中转接口
app.post('/api/fortune', async (req, res) => {
    try {
        console.log('收到请求参数:', req.body);

        const requestBody = {
            parameters: {
                user_input: req.body.user_input,
                remark: req.body.remark
            },
            workflow_id: "7464237624209014819",
            app_id: "7463866118319915023"
        };

        console.log('构造的请求体:', requestBody);
        
        const response = await fetch('https://api.coze.cn/v1/workflow/run', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer pat_KN295ZyH6Ov1GePcteaXDpFPUUvgV3a0dEtvwFJk9tBSq3iihPoLhzFjOXxcj3Qu',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('COZE API 响应状态:', response.status);
        
        // 检查响应状态
        if (!response.ok) {
            const errorData = await response.json();
            console.error('COZE API 错误详情:', {
                status: response.status,
                statusText: response.statusText,
                errorData: errorData
            });
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        console.log('COZE API 返回成功:', data);

        res.json(data);
    } catch (error) {
        console.error('详细错误信息:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            error: '服务器错误', 
            message: error.message,
            stack: error.stack 
        });
    }
});

app.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
}); 
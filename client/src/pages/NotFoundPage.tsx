import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-primary mb-2">
            404
          </CardTitle>
          <CardDescription className="text-xl text-gray-700 font-semibold">
            ไม่พบหน้าที่คุณต้องการ
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-gray-600 leading-relaxed">
            ขออภัยด้วยนะครับ หน้าที่คุณกำลังมองหาไม่มีอยู่จริง
            <br />
            อาจจะถูกลบไป หรือ URL อาจจะไม่ถูกต้อง
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          <div className="flex gap-2 w-full">
            <Button 
              onClick={handleGoHome}
              className="flex-1"
              size="lg"
            >
              <Home className="mr-2 h-4 w-4" />
              ไปหน้าแรก
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleGoBack}
              className="flex-1"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              ย้อนกลับ
            </Button>
          </div>
          
          <div className="w-full p-3 bg-primary/5 rounded-lg border border-primary/20 text-center">
            <p className="text-sm text-primary">
              หากคุณเชื่อว่านี่คือข้อผิดพลาด
              <br />
              กรุณาติดต่อผู้ดูแลระบบ
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NotFoundPage
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon } from 'lucide-react'

interface Review {
  id: number
  author: string
  avatar: string
  date: string
  rating: number
  comment: string
}

interface PropertyReviewsProps {
  reviews: Review[]
}

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ reviews }) => {
  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-900">
      <CardHeader>
        <CardTitle>Comentarios de los huéspedes</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.map((review) => (
          <div key={review.id} className="mb-6 last:mb-0">
            <div className="flex items-center mb-2">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={review.avatar} alt={review.author} />
                <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{review.author}</h4>
                <p className="text-sm text-muted-foreground">{review.date}</p>
              </div>
              <div className="ml-auto flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm">{review.comment}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default PropertyReviews


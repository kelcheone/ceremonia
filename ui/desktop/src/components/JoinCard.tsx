import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const JoinCard = () => {
  return (
    <div className="w-full lg:w-1/2">
      <Card>
        <CardHeader>
          <CardTitle>Run a Distributed Validator</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg">
            Distribute your validation duties among a set of distributed nodes to improve your validator resilience,
            safety, liveliness, and diversity.
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button className="font-bold text-lg">
            <Link to="/join/operators">Generate New Key Shares</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JoinCard;

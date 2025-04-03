import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  const handleEditProfile = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    // Reset form
    setName(user?.name || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setIsEditing(false);
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Form validation
      if (newPassword && newPassword !== confirmNewPassword) {
        toast.error('New passwords do not match');
        return;
      }
      
      // Only validate password if the user is trying to change it
      if (newPassword && !currentPassword) {
        toast.error('Current password is required to set a new password');
        return;
      }
      
      setIsSubmitting(true);
      
      const updateData: any = { name };
      
      // Only include password fields if the user is trying to change password
      if (newPassword && currentPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }
      
      // Use the updateProfile function from AuthContext
      await updateProfile(updateData);
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
      
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      
    } catch (error: any) {
      // Error handling is now done in the updateProfile function
      console.error('Profile update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            <CardDescription>View and update your account information</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                {isEditing && (
                  <>
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-4">Change Password (Optional)</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                          <Input
                            id="confirmNewPassword"
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <CardFooter className="flex justify-between px-0 pt-6">
                {isEditing ? (
                  <>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                )}
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile; 